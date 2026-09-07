import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShoppingBag,
  Plus,
  Loader2,
  X,
  CheckCircle2,
  Eye,
  Trash2,
  Edit2,
  Sparkles,
  Info,
  UtensilsCrossed,
  Wine
} from "lucide-react";
import {
  listCommandes,
  listMyCommandes,
  listWaiters,
  createCommande,
  getCommande,
  updateCommande,
  deleteCommande
} from "../../../services/commande.service";
import type {
  CommandeResponse,
  WaiterResponse,
  CommandeArticleCreate,
  CommandeArticle
} from "../../../types/commande";
import { AccessDenied } from "../../../components/AccessDenied";
import { RestaurantSkeleton } from "../../../components/RestoSkeletons";
import { useAuth } from "../../../contexts/AuthContext";
import { cn } from "../../../utils/cn";

export const OrdersView: React.FC = () => {
  const { user } = useAuth();
  const [commandes, setCommandes] = useState<CommandeResponse[]>([]);
  const [waiters, setWaiters] = useState<WaiterResponse[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "me">("all");

  const [loading, setLoading] = useState(true);
  const [isDenied, setIsDenied] = useState(false);
  const [search, setSearch] = useState("");
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Modal create states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [articles, setArticles] = useState<CommandeArticleCreate[]>([
    { boissonId: "", repasId: "", qte: 1 }
  ]);
  const [submitting, setSubmitting] = useState(false);

  // Modal inspect / edit states
  const [selectedCommande, setSelectedCommande] = useState<CommandeResponse | null>(null);
  const [isInspectOpen, setIsInspectOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editStatut, setEditStatut] = useState("pending");
  const [editTotal, setEditTotal] = useState<number>(0);

  const fetchData = async () => {
    try {
      setLoading(true);
      setIsDenied(false);

      if (activeTab === "all") {
        try {
          const [cmdRes, waiterRes] = await Promise.all([
            listCommandes(),
            listWaiters().catch(() => ({ data: [] }))
          ]);
          setCommandes(cmdRes.data || []);
          setWaiters(waiterRes.data || []);
        } catch (err: any) {
          // If GET /commandes/ fails with 403 (e.g. user is a serveuse with no admin/resto-wide access), fallback automatically to GET /commandes/me
          if (err.response?.status === 403 || err.response?.status === 401) {
            try {
              const [myCmdRes, waiterRes] = await Promise.all([
                listMyCommandes(),
                listWaiters().catch(() => ({ data: [] }))
              ]);
              setCommandes(myCmdRes.data || []);
              setWaiters(waiterRes.data || []);
              setActiveTab("me");
            } catch (fallbackErr: any) {
              if (fallbackErr.response?.status === 403 || fallbackErr.response?.status === 401) {
                setIsDenied(true);
              }
            }
          } else {
            setError("Impossible de charger les commandes.");
          }
        }
      } else {
        try {
          const [myCmdRes, waiterRes] = await Promise.all([
            listMyCommandes(),
            listWaiters().catch(() => ({ data: [] }))
          ]);
          setCommandes(myCmdRes.data || []);
          setWaiters(waiterRes.data || []);
        } catch (err: any) {
          if (err.response?.status === 403 || err.response?.status === 401) {
            setIsDenied(true);
          } else {
            setError("Impossible de charger vos commandes.");
          }
        }
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  // Set default selected user ID when modal opens or user loads
  useEffect(() => {
    if (user?.id && !selectedUserId) {
      setSelectedUserId(String(user.id));
    }
  }, [user, selectedUserId]);

  const handleCreateArticleChange = (index: number, field: keyof CommandeArticleCreate, value: any) => {
    const updated = [...articles];
    updated[index] = { ...updated[index], [field]: value };
    setArticles(updated);
  };

  const addArticleRow = () => {
    setArticles([...articles, { boissonId: "", repasId: "", qte: 1 }]);
  };

  const removeArticleRow = (index: number) => {
    if (articles.length === 1) return;
    setArticles(articles.filter((_, i) => i !== index));
  };

  const handleCreateCommande = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);

    const targetUserId = selectedUserId || String(user?.id || "");
    if (!targetUserId) {
      setError("Veuillez sélectionner un(e) serveuse/serveur.");
      return;
    }

    // Clean articles payload
    const cleanedArticles = articles.map(art => ({
      boissonId: art.boissonId ? art.boissonId : null,
      repasId: art.repasId ? art.repasId : null,
      qte: Number(art.qte) || 1
    }));

    setSubmitting(true);
    try {
      await createCommande({
        userId: targetUserId,
        articles: cleanedArticles
      });
      setSuccess("Commande créée avec succès !");
      setIsCreateOpen(false);
      setArticles([{ boissonId: "", repasId: "", qte: 1 }]);
      fetchData();
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.detail?.[0]?.msg ||
        err.response?.data?.detail ||
        "Échec de la création de la commande."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleInspect = async (id: string) => {
    setError(null);
    try {
      const res = await getCommande(id);
      setSelectedCommande(res.data);
      setIsInspectOpen(true);
    } catch (err: any) {
      console.error(err);
      setError("Impossible de charger les détails de cette commande.");
    }
  };

  const openEditModal = (cmd: CommandeResponse) => {
    setSelectedCommande(cmd);
    setEditStatut(cmd.statut || "pending");
    setEditTotal(cmd.total || 0);
    setIsEditOpen(true);
  };

  const handleUpdateCommande = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCommande) return;
    setSubmitting(true);
    setError(null);
    try {
      await updateCommande(selectedCommande.id, {
        statut: editStatut,
        total: Number(editTotal)
      });
      setSuccess(`Commande #${selectedCommande.numeroCommande} mise à jour avec succès !`);
      setIsEditOpen(false);
      fetchData();
    } catch (err: any) {
      console.error(err);
      setError("Échec de la mise à jour de la commande.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCommande = async (id: string, numero: string) => {
    if (!window.confirm(`Voulez-vous vraiment supprimer la commande ${numero} ?`)) return;
    setError(null);
    try {
      await deleteCommande(id);
      setSuccess(`Commande ${numero} supprimée avec succès.`);
      fetchData();
    } catch (err: any) {
      console.error(err);
      setError("Impossible de supprimer cette commande.");
    }
  };

  const getStatusBadge = (statut: string) => {
    switch (statut?.toLowerCase()) {
      case "pending":
      case "en attente":
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-warning-light/10 text-warning-light">En attente</span>;
      case "completed":
      case "terminee":
      case "servie":
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-success-light/10 text-success-light">Terminée</span>;
      case "cancelled":
      case "annulee":
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-danger-light/10 text-danger-light">Annulée</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-500/10 text-slate-400">{statut}</span>;
    }
  };

  const renderArticlesSummary = (cmdArticles?: CommandeArticle[]) => {
    if (!cmdArticles || cmdArticles.length === 0) {
      return <span className="text-text-secondary-light dark:text-text-secondary-dark italic">Aucun article</span>;
    }

    return (
      <div className="flex flex-col gap-1 max-w-xs">
        {cmdArticles.map((art, idx) => {
          const name = art.boisson?.nomBoisson || art.repas?.nomRepas || "Article";
          const isBoisson = !!art.boisson?.nomBoisson;
          return (
            <div key={idx} className="flex items-center gap-1.5 text-xs">
              {isBoisson ? (
                <Wine size={12} className="text-amber-400 shrink-0" />
              ) : (
                <UtensilsCrossed size={12} className="text-accent-light shrink-0" />
              )}
              <span className="font-semibold text-text-primary-light dark:text-text-primary-dark truncate">
                {name}
              </span>
              <span className="font-extrabold text-accent-light text-[10px] bg-accent-light/10 px-1.5 py-0.5 rounded-md ml-auto shrink-0">
                x{art.qte}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  const filteredCommandes = commandes.filter(cmd => {
    const term = search.toLowerCase();
    const num = cmd.numeroCommande?.toLowerCase() || "";
    const userName = cmd.user?.name?.toLowerCase() || "";
    const statut = cmd.statut?.toLowerCase() || "";
    const articleMatch = cmd.articles?.some(a =>
      (a.boisson?.nomBoisson?.toLowerCase() || "").includes(term) ||
      (a.repas?.nomRepas?.toLowerCase() || "").includes(term)
    );
    return num.includes(term) || userName.includes(term) || statut.includes(term) || articleMatch;
  });

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="space-y-2 w-1/3">
            <div className="h-8 bg-black/10 dark:bg-white/5 rounded-xl animate-pulse" />
            <div className="h-4 bg-black/10 dark:bg-white/5 rounded-lg animate-pulse w-2/3" />
          </div>
          <div className="h-12 w-60 bg-black/10 dark:bg-white/5 rounded-2xl animate-pulse" />
        </div>
        <RestaurantSkeleton />
      </div>
    );
  }

  if (isDenied) {
    return (
      <AccessDenied
        requiredRole="STAFF RESTAURANT"
        description="L'accès aux commandes nécessite un rôle de serveur, cuisinier ou administrateur dans un restaurant actif."
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-text-primary-light dark:text-text-primary-dark tracking-tight flex items-center gap-3">
            <ShoppingBag className="w-8 h-8 text-accent-light" />
            Gestion des Commandes
          </h2>
          <p className="text-text-secondary-light dark:text-text-secondary-dark mt-1">
            Consultez, créez et suivez l'état des commandes de votre établissement.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          {/* Tab Filter */}
          <div className="p-1 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl flex">
            <button
              onClick={() => setActiveTab("all")}
              className={cn(
                "px-4 py-2 text-xs font-bold rounded-xl transition-all",
                activeTab === "all"
                  ? "bg-accent-light text-white shadow-md"
                  : "text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light"
              )}
            >
              Toutes les commandes
            </button>
            <button
              onClick={() => setActiveTab("me")}
              className={cn(
                "px-4 py-2 text-xs font-bold rounded-xl transition-all",
                activeTab === "me"
                  ? "bg-accent-light text-white shadow-md"
                  : "text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light"
              )}
            >
              Mes commandes
            </button>
          </div>

          <div className="relative group min-w-[200px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary-light group-focus-within:text-accent-light transition-colors" />
            <input
              type="text"
              placeholder="Rechercher (N°, article...)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-light/50 text-text-primary-light dark:text-text-primary-dark text-xs font-medium"
            />
          </div>

          <button
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-accent-light hover:bg-accent-dark text-white rounded-2xl font-bold text-xs transition-all shadow-lg hover:shadow-accent-light/20 active:scale-[0.98]"
          >
            <Plus size={18} />
            Nouvelle Commande
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-sm font-medium">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-500 text-sm font-medium flex items-center gap-2">
          <CheckCircle2 size={18} />
          {success}
        </div>
      )}

      {/* Orders Table Card */}
      <div className="glass-card-premium overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-black/5 dark:border-white/5">
                <th className="px-6 py-4 text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-widest">N° Commande</th>
                <th className="px-6 py-4 text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-widest">Serveur / Serveuse</th>
                <th className="px-6 py-4 text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-widest">Articles Commandés (Pris)</th>
                <th className="px-6 py-4 text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-widest">Total</th>
                <th className="px-6 py-4 text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-widest">Statut</th>
                <th className="px-6 py-4 text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/5">
              {filteredCommandes.map((cmd) => (
                <tr key={cmd.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4 font-bold text-sm text-accent-light dark:text-accent-dark">
                    {cmd.numeroCommande}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">
                    {cmd.user?.name || "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    {renderArticlesSummary(cmd.articles)}
                  </td>
                  <td className="px-6 py-4 text-sm font-extrabold text-success-light">
                    {cmd.total ? `${cmd.total.toLocaleString()} F CFA` : "0 F CFA"}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(cmd.statut)}
                  </td>
                  <td className="px-6 py-4 text-xs text-text-secondary-light dark:text-text-secondary-dark">
                    {cmd.createdAt ? new Date(cmd.createdAt).toLocaleString() : "N/A"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleInspect(cmd.id)}
                        className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 text-text-secondary-light hover:text-accent-light transition-colors"
                        title="Détails"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => openEditModal(cmd)}
                        className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 text-text-secondary-light hover:text-blue-400 transition-colors"
                        title="Modifier"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteCommande(cmd.id, cmd.numeroCommande)}
                        className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 text-text-secondary-light hover:text-red-400 transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredCommandes.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-text-secondary-light dark:text-text-secondary-dark font-medium">
                    Aucune commande trouvée.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Commande Modal */}
      <AnimatePresence>
        {isCreateOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-card-premium w-full max-w-lg p-8 relative overflow-hidden border border-white/20 dark:border-white/5 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-accent-light animate-pulse" />
                  <h3 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">Nouvelle Commande</h3>
                </div>
                <button
                  onClick={() => setIsCreateOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 text-text-secondary-light transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCreateCommande} className="space-y-5">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-primary-light dark:text-text-primary-dark uppercase tracking-wider ml-1">Serveur / Serveuse</label>
                  {waiters.length > 0 ? (
                    <select
                      value={selectedUserId || String(user?.id || "")}
                      onChange={(e) => setSelectedUserId(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-white/5 dark:bg-slate-900 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-light/50 text-text-primary-light dark:text-text-primary-dark text-sm font-semibold"
                    >
                      <option value="" disabled className="dark:bg-slate-900 text-text-secondary-light">Sélectionner le membre de l'équipe...</option>
                      {waiters.map(w => (
                        <option key={w.id} value={w.id} className="dark:bg-slate-900 text-text-primary-light font-semibold">
                          {w.name} ({w.email})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      readOnly
                      value={user ? `${user.name} (${user.email})` : "Utilisateur connecté"}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-text-primary-light dark:text-text-primary-dark text-sm font-semibold opacity-80 cursor-not-allowed"
                    />
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-text-primary-light dark:text-text-primary-dark uppercase tracking-wider ml-1">Articles de la commande</label>
                    <button
                      type="button"
                      onClick={addArticleRow}
                      className="text-xs font-bold text-accent-light hover:underline flex items-center gap-1"
                    >
                      <Plus size={14} /> Ajouter un article
                    </button>
                  </div>

                  {articles.map((art, idx) => (
                    <div key={idx} className="p-3 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/5 rounded-2xl space-y-2 relative">
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="ID Boisson (ex: UUID)"
                          value={art.boissonId || ""}
                          onChange={(e) => handleCreateArticleChange(idx, "boissonId", e.target.value)}
                          className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-text-primary-light dark:text-text-primary-dark"
                        />
                        <input
                          type="text"
                          placeholder="ID Repas (ex: UUID)"
                          value={art.repasId || ""}
                          onChange={(e) => handleCreateArticleChange(idx, "repasId", e.target.value)}
                          className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-text-primary-light dark:text-text-primary-dark"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min={1}
                          placeholder="Quantité"
                          value={art.qte}
                          onChange={(e) => handleCreateArticleChange(idx, "qte", Number(e.target.value))}
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-text-primary-light dark:text-text-primary-dark"
                        />
                        {articles.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeArticleRow(idx)}
                            className="p-2 text-red-400 hover:bg-red-500/10 rounded-xl"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsCreateOpen(false)}
                    className="flex-1 py-3.5 glass-capsule rounded-2xl font-bold text-sm text-text-primary-light dark:text-text-primary-dark transition-all"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-3.5 bg-accent-light hover:bg-accent-dark text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50"
                  >
                    {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Créer la commande"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Inspect Commande Modal */}
      <AnimatePresence>
        {isInspectOpen && selectedCommande && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-card-premium w-full max-w-lg p-8 relative overflow-hidden border border-white/20 dark:border-white/5 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <Info className="w-5 h-5 text-accent-light" />
                  <h3 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">Détails de la Commande</h3>
                </div>
                <button
                  onClick={() => setIsInspectOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 text-text-secondary-light transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4 text-sm">
                <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/5 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-bold text-text-secondary-light uppercase tracking-widest block">N° Commande</span>
                    <span className="text-base font-extrabold text-accent-light">{selectedCommande.numeroCommande}</span>
                  </div>
                  <div>
                    {getStatusBadge(selectedCommande.statut)}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/5 space-y-1">
                  <span className="text-[10px] font-bold text-text-secondary-light uppercase tracking-widest block">Serveur / Serveuse</span>
                  <span className="font-bold text-text-primary-light dark:text-text-primary-dark">{selectedCommande.user?.name} ({selectedCommande.user?.email})</span>
                </div>

                <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/5 space-y-2">
                  <span className="text-[10px] font-bold text-text-secondary-light uppercase tracking-widest block">Articles Commandés</span>
                  {selectedCommande.articles?.map((art: CommandeArticle, i: number) => (
                    <div key={i} className="flex justify-between items-center text-xs border-b border-black/5 dark:border-white/5 pb-2 last:border-0 last:pb-0">
                      <div className="flex items-center gap-2">
                        {art.boisson?.nomBoisson ? (
                          <Wine size={14} className="text-amber-400" />
                        ) : (
                          <UtensilsCrossed size={14} className="text-accent-light" />
                        )}
                        <span className="font-bold text-text-primary-light dark:text-text-primary-dark">
                          {art.boisson?.nomBoisson || art.repas?.nomRepas || "Article"}
                        </span>
                        <span className="text-text-secondary-light font-semibold">x{art.qte}</span>
                      </div>
                      <span className="font-semibold text-text-primary-light dark:text-text-primary-dark">{art.sousTotal} F CFA</span>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/5 flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-text-secondary-light">Total Général</span>
                  <span className="text-lg font-extrabold text-success-light">{selectedCommande.total} F CFA</span>
                </div>
              </div>

              <button
                onClick={() => setIsInspectOpen(false)}
                className="w-full py-3.5 mt-6 glass-capsule rounded-2xl font-bold text-sm text-text-primary-light dark:text-text-primary-dark transition-all"
              >
                Fermer
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Commande Modal */}
      <AnimatePresence>
        {isEditOpen && selectedCommande && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-card-premium w-full max-w-md p-8 relative overflow-hidden border border-white/20 dark:border-white/5"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <Edit2 className="w-5 h-5 text-accent-light" />
                  <h3 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">Mettre à jour la Commande</h3>
                </div>
                <button
                  onClick={() => setIsEditOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 text-text-secondary-light transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleUpdateCommande} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-primary-light dark:text-text-primary-dark uppercase tracking-wider ml-1">Statut</label>
                  <select
                    value={editStatut}
                    onChange={(e) => setEditStatut(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 dark:bg-slate-900 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-light/50 text-text-primary-light dark:text-text-primary-dark text-sm font-semibold"
                  >
                    <option value="pending" className="dark:bg-slate-900">En attente (pending)</option>
                    <option value="completed" className="dark:bg-slate-900">Terminée (completed)</option>
                    <option value="cancelled" className="dark:bg-slate-900">Annulée (cancelled)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-primary-light dark:text-text-primary-dark uppercase tracking-wider ml-1">Total (F CFA)</label>
                  <input
                    type="number"
                    value={editTotal}
                    onChange={(e) => setEditTotal(Number(e.target.value))}
                    min={0}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-light/50 text-text-primary-light dark:text-text-primary-dark text-sm font-semibold"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsEditOpen(false)}
                    className="flex-1 py-3.5 glass-capsule rounded-2xl font-bold text-sm text-text-primary-light dark:text-text-primary-dark transition-all"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-3.5 bg-accent-light hover:bg-accent-dark text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50"
                  >
                    {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sauvegarder"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
