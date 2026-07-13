import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Inbox,
  CheckCircle2,
  X,
  Loader2,
  Mail,
  UserCheck,
  UserX
} from "lucide-react";
import { getRestaurantStaff, approveJoinRequest, rejectJoinRequest } from "../../../services/restaurant.service";
import type { StaffResponse } from "../../../types/restaurant";
import { AccessDenied } from "../../../components/AccessDenied";
import { StaffSkeleton } from "../../../components/RestoSkeletons";

export const RequestsView: React.FC = () => {
  const [requests, setRequests] = useState<StaffResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDenied, setIsDenied] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);

  // Approval modal states
  const [selectedUser, setSelectedUser] = useState<StaffResponse | null>(null);
  const [roleId, setRoleId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setIsDenied(false);
      const res = await getRestaurantStaff();
      // Filter list to keep only PENDING join requests
      const pending = res.data.filter(member => member.status === "PENDING");
      setRequests(pending);
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
    fetchRequests();
  }, []);

  const handleApprove = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    setSuccess(null);
    setSubmitting(true);

    try {
      await approveJoinRequest(selectedUser.id, { roleId });
      setSuccess(`La demande d'affiliation pour "${selectedUser.name}" a été approuvée avec succès !`);
      setSelectedUser(null);
      setRoleId("");
      fetchRequests();
    } catch (err: any) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async (id: string, name: string) => {
    setSuccess(null);
    setRejectingId(id);

    try {
      await rejectJoinRequest(id);
      setSuccess(`La demande d'affiliation pour "${name}" a été rejetée avec succès.`);
      fetchRequests();
    } catch (err: any) {
      console.error(err);
    } finally {
      setRejectingId(null);
    }
  };

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
        requiredRole="ADMINISTRATEUR (ADMIN)"
        description="La gestion des demandes d'affiliation est réservée aux administrateurs ou propriétaires (ADMIN) de l'établissement."
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Upper bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-text-primary-light dark:text-text-primary-dark tracking-tight flex items-center gap-3">
            Demandes d'Affiliation
          </h2>
          <p className="text-text-secondary-light dark:text-text-secondary-dark mt-1">
            Gérez (approbation ou rejet) les collaborateurs souhaitant rejoindre votre établissement de prestige.
          </p>
        </div>
      </div>

      {success && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-500 text-sm font-medium flex items-center gap-2">
          <CheckCircle2 size={18} />
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {requests.map((member) => (
          <motion.div
            key={member.id}
            whileHover={{ y: -4 }}
            className="glass-card-premium p-6 flex flex-col relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-warning-light/40 to-warning-dark/40" />

            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl overflow-hidden bg-black/5 dark:bg-white/5 border border-white/10 flex-shrink-0">
                <img
                  src={member.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"}
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

            <div className="mt-auto space-y-4 pt-4 border-t border-black/5 dark:border-white/5 flex flex-col">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary-light dark:text-text-secondary-dark block mb-1">
                  Statut Demande
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-warning-light/10 text-warning-light font-bold text-xs uppercase tracking-wider">
                  PENDING
                </span>
              </div>

              <div className="flex gap-2.5">
                <button
                  onClick={() => handleReject(member.id, member.name)}
                  disabled={rejectingId === member.id}
                  className="flex-1 py-2 rounded-xl bg-danger-light/10 border border-danger-light/20 text-danger-light hover:bg-danger-light hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition-all hover:scale-102"
                >
                  {rejectingId === member.id ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <>
                      <UserX size={14} />
                      Rejeter
                    </>
                  )}
                </button>

                <button
                  onClick={() => setSelectedUser(member)}
                  disabled={rejectingId === member.id}
                  className="flex-1 py-2 rounded-xl bg-accent-light hover:bg-accent-dark text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all hover:scale-102"
                >
                  <UserCheck size={14} />
                  Approuver
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {requests.length === 0 && (
          <div className="glass-card-premium p-12 text-center col-span-full">
            <Inbox className="w-12 h-12 text-text-secondary-light dark:text-text-secondary-dark mx-auto mb-4 opacity-50" />
            <p className="text-text-secondary-light dark:text-text-secondary-dark font-medium">Aucune demande d'affiliation en attente.</p>
          </div>
        )}
      </div>

      {/* Approval Modal */}
      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-card-premium w-full max-w-md p-8 relative overflow-hidden glass-reflection border border-white/20 dark:border-white/5"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">Approuver la Demande</h3>
                  <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1">Attribuer un rôle à {selectedUser.name}</p>
                </div>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="p-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 text-text-secondary-light dark:text-text-secondary-dark transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleApprove} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-text-primary-light dark:text-text-primary-dark uppercase tracking-wider">
                    UUID du Rôle d'Accès
                  </label>
                  <input
                    type="text"
                    value={roleId}
                    onChange={(e) => setRoleId(e.target.value)}
                    required
                    placeholder="ex: role-uuid-1"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-light/50 focus:border-accent-light transition-all text-text-primary-light dark:text-text-primary-dark text-sm"
                  />
                  <p className="text-[10px] text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
                    Saisissez l'UUID du rôle à accorder à ce collaborateur (Gérant, Serveur, etc.). La demande d'affiliation passera au statut approuvé.
                  </p>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setSelectedUser(null)}
                    className="flex-1 py-3.5 glass-capsule rounded-2xl font-bold text-sm text-text-primary-light dark:text-text-primary-dark hover:scale-[1.02] transition-all"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-3.5 bg-accent-light hover:bg-accent-dark text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-accent-light/20 transition-all hover:scale-[1.02] disabled:opacity-50"
                  >
                    {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Confirmer l'Approbation"}
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
