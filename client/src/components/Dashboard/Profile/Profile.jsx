import { useState } from 'react';
import { CometCard } from "./ui/CometCard.jsx";
import { DeleteModal } from "./DeleteModal.jsx";
import { useAuth } from '../../../contexts/AuthContext';
import {
  IconUser,
  IconMail,
  IconCalendar,
  IconId,
  IconShield,
  IconTrash,
} from '@tabler/icons-react';


export function Profile() {
  const { currentUser } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);


  const getJoinedDate = () => {
    if (currentUser?.createdAt) {
      return new Date(currentUser.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
    if (currentUser?.id) {
      try {
        const tsSeconds = parseInt(currentUser.id.substring(0, 8), 16);
        return new Date(tsSeconds * 1000).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      } catch { /* fall through */ }
    }
    return 'Early Member';
  };
  const joinedDate = getJoinedDate();

  return (
    <div className="flex h-full w-full items-start md:items-center justify-center bg-zinc-50 dark:bg-neutral-800 p-4 md:p-8 overflow-y-auto">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 w-full max-w-3xl items-center lg:items-start mt-4 md:mt-0">

        <CometCard className="shrink-0">
          <div
            className="flex w-72 cursor-default flex-col items-stretch rounded-[20px] bg-[#1a1c1c] overflow-hidden"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Header */}
            <div className="relative flex flex-col items-center bg-[#141616] pb-6 pt-10">
              <div className="absolute inset-0 opacity-[0.04] [background-image:repeating-linear-gradient(0deg,transparent,transparent_1px,rgba(255,255,255,0.5)_1px,rgba(255,255,255,0.5)_2px),repeating-linear-gradient(90deg,transparent,transparent_1px,rgba(255,255,255,0.5)_1px,rgba(255,255,255,0.5)_2px)] [background-size:24px_24px]" />
              <div className="absolute bottom-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <div className="size-24 rounded-full ring-4 ring-[#1a1c1c] overflow-hidden shadow-lg relative z-10">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || 'U')}&background=52525b&color=ffffff&bold=true&size=96`}
                  className="size-full object-cover"
                  alt="Avatar"
                />
              </div>
            </div>

            <div className="flex flex-col items-center px-6 pt-5 pb-6">
              <h2 className="text-xl font-semibold text-white text-balance">
                {currentUser?.name || 'User'}
              </h2>
              <div className="flex items-center gap-1.5 mt-1.5">
                <IconMail size={13} className="text-white/40" />
                <p className="text-white/50 text-xs text-pretty">{currentUser?.email || '—'}</p>
              </div>

              <div className="w-full h-px bg-white/10 my-5" />

              <div className="w-full flex flex-col gap-2.5">
                <div className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
                  <div className="flex items-center gap-2 text-white/50">
                    <IconCalendar size={15} />
                    <span className="text-xs">Member since</span>
                  </div>
                  <span className="text-xs tabular-nums text-white/80 font-medium">{joinedDate}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
                  <div className="flex items-center gap-2 text-white/50">
                    <IconShield size={15} />
                    <span className="text-xs">Account type</span>
                  </div>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-white/10 text-white/70">
                    Free
                  </span>
                </div>
              </div>

            </div>

            <div className="flex items-center justify-between border-t border-white/10 px-5 py-3 font-mono">
              <span className="text-xs text-white/30">stratus</span>
              <span className="text-[10px] text-white/20">v1.0</span>
            </div>
          </div>
        </CometCard>

        <div className="flex flex-1 flex-col gap-4 min-w-0">

          <div className="rounded-2xl bg-[#1a1c1c] overflow-hidden">
            <div className="px-5 py-4 border-b border-white/[0.08]">
              <h3 className="text-sm font-semibold text-white">Account details</h3>
              <p className="text-xs text-white/40 mt-0.5 text-pretty">Your personal information stored with Stratus.</p>
            </div>
            <div className="divide-y divide-white/[0.05]">
              {[
                { icon: IconUser,     label: 'Full name', value: currentUser?.name     || '—' },
                { icon: IconId,       label: 'Username',  value: currentUser?.username  || '—' },
                { icon: IconMail,     label: 'Email',     value: currentUser?.email     || '—' },
                { icon: IconCalendar, label: 'Joined',    value: joinedDate              },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-4 px-5 py-3.5">
                  <div className="size-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                    <Icon size={15} className="text-white/40" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] text-white/40 mb-0.5">{label}</p>
                    <p className="text-sm text-white/80 truncate">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-[#1a1c1c] border border-red-500/10 overflow-hidden">
            <div className="px-5 py-4 border-b border-red-500/10">
              <h3 className="text-sm font-semibold text-red-400/80">Danger zone</h3>
              <p className="text-xs text-white/40 mt-0.5 text-pretty">Irreversible actions — proceed with caution.</p>
            </div>
            <div className="px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
                  <IconTrash size={15} className="text-red-400/70" />
                </div>
                <div>
                  <p className="text-sm text-white/70">Delete account</p>
                  <p className="text-xs text-white/40 text-pretty">Permanently removes all your data.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                className="rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-colors px-3 py-1.5 text-xs font-medium text-red-400/80"
              >
                Delete
              </button>
            </div>
          </div>

        </div>
      </div>

      {showDeleteModal && (
        <DeleteModal onClose={() => setShowDeleteModal(false)} />
      )}
    </div>
  );
}
