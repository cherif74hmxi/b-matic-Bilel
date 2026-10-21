import { useEffect, useId, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ImagePlus, Info, Loader2, Sparkles, Trash2 } from "lucide-react";
import { toast } from "sonner";
import useSeo from "@/hooks/useSeo";
import { Field, FormSection } from "@/components/admin/FormParts";
import { adminInputClass, adminTextareaClass } from "@/components/admin/formStyles";
import { PostActionsMenu, PostStatusBadge } from "@/components/admin/PostActions";
import { AdminLoading } from "@/components/admin/RequireAdmin";
import { UnsupportedImageError } from "@/lib/imageOptimize";
import {
  autoExcerpt,
  createPost,
  getPost,
  postImageUrl,
  removePostCover,
  replacePostCover,
  updatePost,
  type Post,
  type PostInput,
} from "@/lib/posts";
import { slugify } from "@/lib/slug";
import { guardLinkClick, setUnsaved } from "@/lib/unsavedChanges";

// ============================================================================
//  Ajout / édition d'une actualité (admin)
//  /admin/actualites/nouvelle → création (brouillon) puis /admin/actualites/:id
// ============================================================================

const schema = z.object({
  title: z.string().trim().min(1, "Indiquez un titre.").max(200, "200 caractères maximum."),
  slug: z
    .string()
    .trim()
    .max(80, "80 caractères maximum.")
    .refine((v) => v === "" || /^[a-z0-9]+(-[a-z0-9]+)*$/.test(v), "Minuscules, chiffres et tirets uniquement."),
  excerpt: z.string().trim().max(500, "500 caractères maximum."),
  content: z.string().max(50000, "50 000 caractères maximum."),
});

type FormValues = z.infer<typeof schema>;

const toFormValues = (p?: Post): FormValues => ({
  title: p?.title ?? "",
  slug: p?.slug ?? "",
  // Extrait identique à celui généré → laissé vide pour qu'il suive le contenu.
  excerpt: p?.excerpt && p.excerpt !== autoExcerpt(p.content) ? p.excerpt : "",
  content: p?.content ?? "",
});

const toInput = (f: FormValues, post?: Post): PostInput => ({
  title: f.title.trim(),
  // Champ vidé sur une actu existante → on garde son adresse (ne pas casser les liens).
  slug: f.slug.trim() || post?.slug || slugify(f.title),
  // Extrait vide → généré depuis le contenu (utile pour la liste publique et le SEO).
  excerpt: f.excerpt.trim() || autoExcerpt(f.content) || null,
  content: f.content.trim(),
});

/** Image de couverture : choix, remplacement, suppression (optimisée en WebP). */
const CoverImage = ({ post }: { post: Post }) => {
  const queryClient = useQueryClient();
  const inputId = useId();
  // Ne met à jour que l'image : un enregistrement du texte peut être en cours.
  const onSaved = (updated: Post) => {
    queryClient.setQueryData<Post>(["admin", "post", updated.id], (old) => (old ? { ...old, cover_path: updated.cover_path } : updated));
    void queryClient.invalidateQueries({ queryKey: ["admin", "posts"] });
  };
  const replace = useMutation({
    mutationFn: (file: File) => replacePostCover(post, file),
    onSuccess: (updated) => {
      onSaved(updated);
      toast.success("Image enregistrée.");
    },
    onError: (error) =>
      toast.error(
        error instanceof UnsupportedImageError
          ? "Format non pris en charge (HEIC ?). Utilisez une image JPEG ou PNG."
          : "Envoi impossible. Vérifiez la connexion et réessayez.",
      ),
  });
  const remove = useMutation({
    mutationFn: () => removePostCover(post),
    onSuccess: onSaved,
    onError: () => toast.error("Suppression impossible."),
  });
  const busy = replace.isPending || remove.isPending;

  return (
    <div className="grid gap-3">
      <div className="relative aspect-[16/9] rounded-xl overflow-hidden border border-border bg-muted flex items-center justify-center">
        {post.cover_path ? (
          <img src={postImageUrl(post.cover_path)} alt="" className="w-full h-full object-cover" />
        ) : (
          <span className="text-sm text-muted-foreground">Aucune image</span>
        )}
        {busy && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70" role="status">
            <Loader2 className="w-7 h-7 text-neon-purple animate-spin" aria-hidden="true" />
            <span className="sr-only">Envoi en cours…</span>
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        <label htmlFor={inputId} className={`btn-ghost min-h-[44px] px-4 cursor-pointer ${busy ? "opacity-50 pointer-events-none" : ""}`}>
          <ImagePlus className="w-4 h-4" aria-hidden="true" />
          {post.cover_path ? "Remplacer l'image" : "Ajouter une image"}
          <input
            id={inputId}
            type="file"
            accept="image/*"
            className="sr-only"
            disabled={busy}
            onChange={(e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (file) replace.mutate(file);
            }}
          />
        </label>
        {post.cover_path && (
          <button type="button" onClick={() => remove.mutate()} disabled={busy} className="btn-ghost min-h-[44px] px-4 hover:text-neon-pink">
            <Trash2 className="w-4 h-4" aria-hidden="true" />
            Retirer
          </button>
        )}
      </div>
    </div>
  );
};

const PostForm = ({ post }: { post?: Post }) => {
  const isNew = !post;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: toFormValues(post), mode: "onTouched" });

  // Slug : suit le titre tant qu'il n'a pas été modifié (création seulement).
  const slugTouched = useRef(!isNew);
  const title = watch("title");
  useEffect(() => {
    if (!slugTouched.current) setValue("slug", slugify(title ?? ""), { shouldDirty: true });
  }, [title, setValue]);

  useEffect(() => {
    setUnsaved(isDirty);
    return () => setUnsaved(false);
  }, [isDirty]);
  useEffect(() => {
    if (!isDirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [isDirty]);

  const save = useMutation({
    mutationFn: (values: FormValues) => {
      const input = toInput(values, post);
      if (!post) return createPost(input);
      // Adresse inchangée → pas de vérification d'unicité inutile.
      const { slug, ...rest } = input;
      return updatePost(post.id, slug === post.slug ? rest : input);
    },
    onSuccess: (saved) => {
      // L'image peut avoir changé pendant l'enregistrement : on garde celle du cache.
      queryClient.setQueryData<Post>(["admin", "post", saved.id], (old) => (old ? { ...saved, cover_path: old.cover_path } : saved));
      void queryClient.invalidateQueries({ queryKey: ["admin", "posts"] });
      void queryClient.invalidateQueries({ queryKey: ["admin", "kpis"] });
      reset(toFormValues(saved));
      if (isNew) {
        toast.success("Brouillon enregistré. Vous pouvez ajouter une image.");
        navigate(`/admin/actualites/${saved.id}`, { replace: true });
      } else {
        toast.success("Modifications enregistrées.");
      }
    },
    onError: () => toast.error("Enregistrement impossible. Vérifiez votre connexion et réessayez."),
  });

  const onSubmit = (values: FormValues) => {
    if (post?.status === "published" && values.content.trim().length < 50) {
      toast.error("Une actualité en ligne doit garder un contenu d'au moins 50 caractères.");
      return;
    }
    save.mutate(values);
  };

  const fieldProps = (name: keyof FormValues, hinted = false) => ({
    id: `p-${name}`,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `p-${name}-error` : hinted ? `p-${name}-hint` : undefined,
    ...register(name),
  });
  const content = watch("content") ?? "";

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="pb-28 md:pb-0">
      <Link to="/admin/actualites" onClick={guardLinkClick} className="inline-flex items-center gap-2 min-h-[44px] text-sm text-muted-foreground hover:text-foreground mb-2">
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        Actualités
      </Link>
      <div className="flex items-start justify-between gap-3 mb-6">
        <div className="min-w-0">
          <h1 className="font-heading text-xl md:text-2xl font-bold text-gradient-neon break-words">{post ? post.title : "Nouvelle actualité"}</h1>
          {post && (
            <div className="mt-2">
              <PostStatusBadge status={post.status} />
            </div>
          )}
        </div>
        {post && (
          <PostActionsMenu
            post={post}
            showEdit={false}
            unsavedChanges={isDirty}
            onDeleted={() => {
              setUnsaved(false);
              navigate("/admin/actualites", { replace: true });
            }}
          />
        )}
      </div>

      <div className="grid gap-4">
        <FormSection title="Article">
          <Field id="p-title" label="Titre" required error={errors.title?.message}>
            <input {...fieldProps("title")} autoComplete="off" className={adminInputClass} />
          </Field>
          <Field id="p-content" label="Contenu" error={errors.content?.message} hint={`${content.length} caractères. Une ligne vide sépare deux paragraphes.`}>
            <textarea {...fieldProps("content", true)} rows={12} className={adminTextareaClass} />
          </Field>
          <Field
            id="p-excerpt"
            label="Résumé (facultatif)"
            error={errors.excerpt?.message}
            hint="Affiché dans la liste des actualités et sur Google. Laissez vide pour le générer depuis le contenu."
          >
            <textarea {...fieldProps("excerpt", true)} rows={3} className={`${adminTextareaClass} min-h-[96px]`} />
          </Field>
          <Field
            id="p-slug"
            label="Adresse de la page"
            error={errors.slug?.message}
            hint={
              post?.status === "published"
                ? "Attention : changer l'adresse d'une actualité en ligne casse les liens déjà partagés."
                : "Générée depuis le titre. Si elle existe déjà, un numéro est ajouté."
            }
          >
            <div className="flex items-center rounded-lg border border-border bg-input focus-within:ring-2 focus-within:ring-primary/50">
              <span className="pl-4 text-sm text-muted-foreground shrink-0">/actualites/</span>
              <input
                {...fieldProps("slug", true)}
                onChange={(e) => {
                  slugTouched.current = true;
                  void register("slug").onChange(e);
                }}
                autoCapitalize="none"
                autoComplete="off"
                spellCheck={false}
                className="flex-1 min-w-0 min-h-[48px] bg-transparent pr-4 pl-1 text-base font-mono focus:outline-none"
              />
            </div>
          </Field>
          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <Sparkles className="w-4 h-4 text-neon-purple shrink-0" aria-hidden="true" />
            L'assistant IA (titre + contenu) arrive à l'étape suivante.
          </p>
        </FormSection>

        {post ? (
          <FormSection title="Image de couverture">
            <CoverImage post={post} />
          </FormSection>
        ) : (
          <p className="flex gap-2 text-sm text-muted-foreground px-1">
            <Info className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
            L'actualité est d'abord enregistrée en brouillon (invisible sur le site). Vous pourrez ensuite ajouter une image et la
            publier.
          </p>
        )}
      </div>

      <div className="fixed md:sticky inset-x-0 bottom-[calc(56px+env(safe-area-inset-bottom))] md:bottom-4 z-30 mt-6 border-t md:border border-border bg-background/95 backdrop-blur-xl px-4 py-3 md:rounded-xl md:px-4">
        <div className="flex items-center justify-between gap-3 max-w-5xl mx-auto">
          <span className="text-xs text-muted-foreground hidden sm:block">{isDirty ? "Modifications non enregistrées" : "Tout est enregistré"}</span>
          <button type="submit" disabled={save.isPending || (!isNew && !isDirty)} className="btn-main min-h-[48px] w-full sm:w-auto">
            {save.isPending && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
            {isNew ? "Enregistrer le brouillon" : "Enregistrer"}
          </button>
        </div>
      </div>
    </form>
  );
};

const AdminActualiteForm = () => {
  const { id } = useParams();
  const post = useQuery({ queryKey: ["admin", "post", id], queryFn: () => getPost(id!), enabled: Boolean(id) });
  useSeo({ title: `${id ? post.data?.title ?? "Actualité" : "Nouvelle actualité"} — Admin B MATIC` });

  if (id && post.isLoading) return <AdminLoading />;
  if (id && (post.isError || !post.data)) {
    return (
      <div className="text-center py-12">
        <p className="mb-4">Actualité introuvable ou chargement impossible.</p>
        <Link to="/admin/actualites" className="btn-ghost min-h-[44px]">
          Retour à la liste
        </Link>
      </div>
    );
  }
  return <PostForm key={id ?? "new"} post={post.data} />;
};

export default AdminActualiteForm;
