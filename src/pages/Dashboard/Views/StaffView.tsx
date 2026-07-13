import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Users2,
  Edit2,
  X,
  Loader2,
  ShieldCheck,
  CheckCircle2,
  Mail
} from "lucide-react";
import { getRestaurantStaff, updateEmployeeRoles } from "../../../services/restaurant.service";
import type { StaffResponse } from "../../../types/restaurant";
import { AccessDenied } from "../../../components/AccessDenied";
import { StaffSkeleton } from "../../../components/RestoSkeletons";

export const StaffView: React.FC = () => {
  const [staff, setStaff] = useState<StaffResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isDenied, setIsDenied] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  // Modal State for Roles Update
  const [selectedEmployee, setSelectedEmployee] = useState<StaffResponse | null>(null);
  const [roleIds, setRoleIds] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      setIsDenied(false);
      const res = await getRestaurantStaff();
      setStaff(res.data);
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 403 || err.response?.status === 401) {
        setIsDenied(true);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleUpdateRoles = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployee) return;

    setSuccess(null);
    setSubmitting(true);

    try {
      const ids = roleIds.split(",").map(id => id.trim()).filter(id => id.length > 0);
      await updateEmployeeRoles(selectedEmployee.id, { roleIds: ids });
      setSuccess("Rôles mis à jour avec succès !");
      setSelectedEmployee(null);
      fetchStaff();
    } catch (err: any) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = staff.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase()) ||
    (m.role?.name || "").toLowerCase().includes(search.toLowerCase())
  );

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
        <StaffSkeleton />
      </div>
    );
  }

  if (isDenied) {
    return (
      <AccessDenied
        requiredRole="PROPRIÉTAIRE (ADMIN)"
        description="L'accès à la gestion du personnel est strictement restreint au propriétaire (ADMIN) de l'établissement."
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Upper info / Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-text-primary-light dark:text-text-primary-dark tracking-tight">
            Personnel du Restaurant
          </h2>
          <p className="text-text-secondary-light dark:text-text-secondary-dark mt-1">
            Gérez l'attribution des rôles et administrez les permissions de vos équipes de prestige.
          </p>
        </div>

        <div className="relative group min-w-[240px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary-light dark:text-text-secondary-dark group-focus-within:text-accent-light transition-colors" />
          <input
            type="text"
            placeholder="Rechercher un membre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-light/50 focus:border-accent-light transition-all text-text-primary-light dark:text-text-primary-dark text-sm"
          />
        </div>
      </div>

      {success && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-500 text-sm font-medium flex items-center gap-2">
          <CheckCircle2 size={18} />
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((member) => (
          <motion.div
            key={member.id}
            whileHover={{ y: -4 }}
            className="glass-card-premium p-6 flex flex-col relative overflow-hidden"
          >
            {/* Decorative top glass glow */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent-light/40 via-purple-500/40 to-accent-neon/40" />

            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl overflow-hidden bg-black/5 dark:bg-white/5 border border-white/10 flex-shrink-0">
                <img
                  src={member.picture || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-bold text-lg text-text-primary-light dark:text-text-primary-dark">{member.name}</h3>
                <div className="flex items-center gap-1.5 text-xs text-text-secondary-light dark:text-text-secondary-dark">
                  <Mail size={12} />
                  <span>{member.email}</span>
                </div>
              </div>
            </div>

            <div className="mt-auto space-y-4 pt-4 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary-light dark:text-text-secondary-dark block mb-1">
                  Rôle d'Accès
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent-light/10 text-accent-light font-bold text-xs uppercase tracking-wider">
                  <ShieldCheck size={12} />
                  {member.role?.name || "Membre standard"}
                </span>
              </div>

              <button
                onClick={() => {
                  setSelectedEmployee(member);
                  setRoleIds(member.role?.id || "");
                }}
                className="p-3 rounded-xl glass-capsule text-text-secondary-light dark:text-text-secondary-dark hover:text-accent-light dark:hover:text-accent-dark hover:scale-105 transition-all"
                title="Modifier les rôles"
              >
                <Edit2 size={16} />
              </button>
            </div>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <div className="glass-card-premium p-12 text-center col-span-full">
            <Users2 className="w-12 h-12 text-text-secondary-light dark:text-text-secondary-dark mx-auto mb-4 opacity-50" />
            <p className="text-text-secondary-light dark:text-text-secondary-dark font-medium">Aucun membre ne correspond à votre recherche.</p>
          </div>
        )}
      </div>

      {/* Role Modification Modal */}
      <AnimatePresence>
        {selectedEmployee && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-card-premium w-full max-w-md p-8 relative overflow-hidden glass-reflection border border-white/20 dark:border-white/5"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">Modifier les Rôles</h3>
                  <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1">Pour {selectedEmployee.name}</p>
                </div>
                <button
                  onClick={() => setSelectedEmployee(null)}
                  className="p-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 text-text-secondary-light dark:text-text-secondary-dark transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleUpdateRoles} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-text-primary-light dark:text-text-primary-dark uppercase tracking-wider">
                    UUID des rôles (séparés par des virgules)
                  </label>
                  <input
                    type="text"
                    value={roleIds}
                    onChange={(e) => setRoleIds(e.target.value)}
                    required
                    placeholder="ex: role-uuid-1, role-uuid-2"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-light/50 focus:border-accent-light transition-all text-text-primary-light dark:text-text-primary-dark text-sm"
                  />
                  <p className="text-[10px] text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
                    Saisissez les identifiants UUID des rôles à attribuer à cet employé. Cette opération écrasera ses rôles actuels.
                  </p>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setSelectedEmployee(null)}
                    className="flex-1 py-3.5 glass-capsule rounded-2xl font-bold text-sm text-text-primary-light dark:text-text-primary-dark hover:scale-[1.02] transition-all"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-3.5 bg-accent-light hover:bg-accent-dark text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-accent-light/20 transition-all hover:scale-[1.02] disabled:opacity-50"
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
