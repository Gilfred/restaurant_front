import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Users2,
  Mail,
  ShieldCheck
} from "lucide-react";
import { getEmployees } from "../../../services/restaurant.service";
import type { StaffResponse } from "../../../types/restaurant";
import { AccessDenied } from "../../../components/AccessDenied";
import { StaffSkeleton } from "../../../components/RestoSkeletons";

export const EmployeesView: React.FC = () => {
  const [employees, setEmployees] = useState<StaffResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDenied, setIsDenied] = useState(false);
  const [search, setSearch] = useState("");

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setIsDenied(false);
      const res = await getEmployees();
      setEmployees(res.data);
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
    fetchEmployees();
  }, []);

  const filtered = employees.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.email.toLowerCase().includes(search.toLowerCase()) ||
    (e.role?.name || "").toLowerCase().includes(search.toLowerCase())
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
        requiredRole="ADMINISTRATEUR (ADMIN)"
        description="L'accès à la liste globale des employés est strictement restreint au propriétaire (ADMIN) ou aux administrateurs."
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Upper info / Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-text-primary-light dark:text-text-primary-dark tracking-tight">
            Employés de l'Établissement
          </h2>
          <p className="text-text-secondary-light dark:text-text-secondary-dark mt-1">
            Consultez la liste complète de l'ensemble du personnel associé à votre restaurant.
          </p>
        </div>

        <div className="relative group min-w-[240px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary-light dark:text-text-secondary-dark group-focus-within:text-accent-light transition-colors" />
          <input
            type="text"
            placeholder="Rechercher par nom, rôle..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-light/50 focus:border-accent-light transition-all text-text-primary-light dark:text-text-primary-dark text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((member) => (
          <motion.div
            key={member.id}
            whileHover={{ y: -4 }}
            className="glass-card-premium p-6 flex flex-col relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent-light/40 to-accent-neon/40" />

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
                <div className="flex items-center gap-1.5 text-xs text-text-secondary-light dark:text-text-secondary-dark font-medium">
                  <Mail size={12} />
                  <span>{member.email}</span>
                </div>
              </div>
            </div>

            <div className="mt-auto space-y-4 pt-4 border-t border-black/5 dark:border-white/5 flex justify-between items-center">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary-light dark:text-text-secondary-dark block">
                  Rôle Attribué
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-light/10 text-accent-light font-bold text-xs uppercase tracking-wider">
                  <ShieldCheck size={12} />
                  {member.role?.name || "Membre standard"}
                </span>
                {member.role?.description && (
                  <p className="text-[10px] text-text-secondary-light dark:text-text-secondary-dark italic font-medium leading-relaxed mt-1">
                    {member.role.description}
                  </p>
                )}
              </div>

              <div className="flex flex-col items-end gap-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary-light dark:text-text-secondary-dark block">
                  Statut
                </span>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide ${
                  member.status === "PENDING"
                    ? "bg-warning-light/10 text-warning-light border border-warning-light/20"
                    : "bg-success-light/10 text-success-light border border-success-light/20"
                }`}>
                  {member.status}
                </span>
              </div>
            </div>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <div className="glass-card-premium p-12 text-center col-span-full">
            <Users2 className="w-12 h-12 text-text-secondary-light dark:text-text-secondary-dark mx-auto mb-4 opacity-50" />
            <p className="text-text-secondary-light dark:text-text-secondary-dark font-medium">Aucun employé ne correspond à votre recherche.</p>
          </div>
        )}
      </div>
    </div>
  );
};
