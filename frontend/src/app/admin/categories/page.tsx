"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  FolderTree,
} from "lucide-react";
import {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/services/category.service";
import type { Category } from "@/lib/types";

// =============================================================================
// Admin — Category Management Page
// =============================================================================

interface CategoryFormData {
  name: string;
  slug: string;
  icon: string;
  description: string;
}

const EMPTY_FORM: CategoryFormData = {
  name: "",
  slug: "",
  icon: "",
  description: "",
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>(EMPTY_FORM);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await listCategories();
      setCategories(result);
    } catch {
      toast.error("Failed to load categories.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const resetForm = () => {
    setFormData(EMPTY_FORM);
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (category: Category) => {
    setFormData({
      name: category.name,
      slug: category.slug,
      icon: category.icon || "",
      description: category.description || "",
    });
    setEditingId(category.$id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.slug.trim()) {
      toast.error("Name and slug are required.");
      return;
    }

    setIsSubmitting(true);
    try {
      const data = {
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        icon: formData.icon.trim() || undefined,
        description: formData.description.trim() || undefined,
      };

      if (editingId) {
        await updateCategory(editingId, data);
        toast.success(`"${data.name}" updated.`);
      } else {
        await createCategory(data);
        toast.success(`"${data.name}" created.`);
      }

      resetForm();
      await fetchCategories();
    } catch {
      toast.error(
        editingId ? "Failed to update category." : "Failed to create category."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (category: Category) => {
    setIsSubmitting(true);
    try {
      await deleteCategory(category.$id);
      toast.success(`"${category.name}" deleted.`);
      setDeleteConfirm(null);
      await fetchCategories();
    } catch {
      toast.error("Failed to delete category.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight font-[family-name:var(--font-heading)]">
            Category Management
          </h1>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            {categories.length} categor{categories.length !== 1 ? "ies" : "y"}
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--etsy-orange)] px-4 py-2.5 text-sm font-medium text-white hover:bg-[var(--etsy-orange-hover)] transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Category
          </button>
        )}
      </div>

      {/* Create/Edit form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">
              {editingId ? "Edit Category" : "New Category"}
            </h2>
            <button
              type="button"
              onClick={resetForm}
              className="rounded-md p-1.5 text-[var(--muted-foreground)] hover:bg-[var(--accent)] transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setFormData((prev) => ({
                    ...prev,
                    name,
                    slug: editingId ? prev.slug : generateSlug(name),
                  }));
                }}
                placeholder="e.g. Handmade Jewelry"
                className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--etsy-orange)]/50"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">
                Slug <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, slug: e.target.value }))
                }
                placeholder="e.g. handmade-jewelry"
                className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--etsy-orange)]/50"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Icon</label>
              <input
                type="text"
                value={formData.icon}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, icon: e.target.value }))
                }
                placeholder="e.g. 💎 or icon name"
                className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--etsy-orange)]/50"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Description</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Brief description"
                className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--etsy-orange)]/50"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium hover:bg-[var(--accent)] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--etsy-orange)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--etsy-orange-hover)] disabled:opacity-50 transition-colors"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {editingId ? "Update" : "Create"}
            </button>
          </div>
        </form>
      )}

      {/* List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--etsy-orange)]" />
        </div>
      ) : categories.length === 0 ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <FolderTree className="mx-auto h-10 w-10 text-[var(--muted-foreground)]/50" />
            <p className="mt-3 text-sm text-[var(--muted-foreground)]">
              No categories yet. Create your first one!
            </p>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-[var(--border)]">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[var(--accent)]/50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-[var(--muted-foreground)]">
                    Icon
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-[var(--muted-foreground)]">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-[var(--muted-foreground)]">
                    Slug
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-[var(--muted-foreground)]">
                    Description
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-[var(--muted-foreground)]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)] bg-[var(--card)]">
                {categories.map((category) => (
                  <tr
                    key={category.$id}
                    className="hover:bg-[var(--accent)]/30 transition-colors"
                  >
                    <td className="px-4 py-3 text-lg">
                      {category.icon || "—"}
                    </td>
                    <td className="px-4 py-3 font-medium">{category.name}</td>
                    <td className="px-4 py-3 text-[var(--muted-foreground)]">
                      /{category.slug}
                    </td>
                    <td className="px-4 py-3 text-[var(--muted-foreground)] max-w-[250px] truncate">
                      {category.description || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(category)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-500/20 transition-colors"
                        >
                          <Pencil className="h-3 w-3" />
                          Edit
                        </button>

                        {deleteConfirm === category.$id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleDelete(category)}
                              disabled={isSubmitting}
                              className="inline-flex items-center gap-1 rounded-lg bg-red-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-600 disabled:opacity-50 transition-colors"
                            >
                              {isSubmitting ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                "Confirm"
                              )}
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="rounded-lg border border-[var(--border)] px-2 py-1.5 text-xs hover:bg-[var(--accent)] transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(category.$id)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-500/20 transition-colors"
                          >
                            <Trash2 className="h-3 w-3" />
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
