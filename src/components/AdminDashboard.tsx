import { useState, useEffect } from 'react';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  updateDoc,
  getDoc
} from 'firebase/firestore';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged,
  User,
  signOut
} from 'firebase/auth';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ClipboardList, 
  Clock, 
  CheckCircle, 
  XCircle, 
  LogOut, 
  LogIn,
  Calendar,
  Phone,
  User as UserIcon,
  Filter,
  ShieldAlert,
  Mail,
  MessageSquare
} from 'lucide-react';

interface Consultation {
  id: string;
  name: string;
  phone: string;
  service: string;
  status: 'pending' | 'contacted' | 'completed' | 'cancelled';
  createdAt: any;
}

interface Message {
  id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  createdAt: any;
}

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeTab, setActiveTab] = useState<'consultations' | 'messages'>('consultations');
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'contacted' | 'completed' | 'cancelled'>('all');

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Check if user is admin
        try {
          const adminDoc = await getDoc(doc(db, 'admins', currentUser.uid));
          if (adminDoc.exists() || currentUser.email === 'saransh1860@gmail.com') {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        } catch (error) {
          console.error("Error checking admin status:", error);
          // Fallback to email check if Firestore read fails
          if (currentUser.email === 'saransh1860@gmail.com') {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!isAdmin) return;

    const qC = query(collection(db, 'consultations'), orderBy('createdAt', 'desc'));
    const unsubscribeC = onSnapshot(qC, 
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Consultation[];
        setConsultations(data);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'consultations');
      }
    );

    const qM = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
    const unsubscribeM = onSnapshot(qM, 
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Message[];
        setMessages(data);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'messages');
      }
    );

    return () => {
      unsubscribeC();
      unsubscribeM();
    };
  }, [isAdmin]);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = () => signOut(auth);

  const updateStatus = async (id: string, newStatus: Consultation['status']) => {
    try {
      await updateDoc(doc(db, 'consultations', id), { status: newStatus });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `consultations/${id}`);
    }
  };

  const filteredConsultations = filter === 'all' 
    ? consultations 
    : consultations.filter(c => c.status === filter);

  if (loading) {
    return (
      <div className="min-h-screen bg-luxury-bg flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-luxury-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-luxury-bg flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md bg-white p-12 rounded-3xl shadow-xl border border-luxury-ink/5"
        >
          <div className="w-20 h-20 bg-luxury-gold/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <ClipboardList className="w-10 h-10 text-luxury-gold" />
          </div>
          <h1 className="text-3xl font-serif mb-4 text-luxury-ink">Admin Access</h1>
          <p className="text-luxury-ink/60 mb-8">
            Please log in with your authorized account to view booked consultations.
          </p>
          <button
            onClick={handleLogin}
            className="w-full bg-luxury-ink text-white py-4 rounded-full flex items-center justify-center gap-3 hover:bg-luxury-gold transition-all duration-300 shadow-lg font-medium"
          >
            <LogIn className="w-5 h-5" /> Sign in with Google
          </button>
        </motion.div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-luxury-bg flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md bg-white p-12 rounded-3xl shadow-xl border border-red-100">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8">
            <ShieldAlert className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-3xl font-serif mb-4 text-red-600">Access Denied</h1>
          <p className="text-luxury-ink/60 mb-8">
            Your account ({user.email}) is not authorized to access this dashboard. 
            Please contact the system administrator.
          </p>
          <div className="space-y-4">
            <button
               onClick={handleLogout}
               className="w-full border border-luxury-ink/10 text-luxury-ink py-4 rounded-full flex items-center justify-center gap-3 hover:bg-luxury-ink hover:text-white transition-all duration-300 font-medium"
            >
              <LogOut className="w-5 h-5" /> Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-bg">
      {/* Sidebar/Header */}
      <header className="bg-luxury-ink text-white p-6 sticky top-0 z-30 shadow-lg">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-luxury-gold rounded-xl flex items-center justify-center shadow-lg transform -rotate-6">
              <ClipboardList className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-serif">Admin Portal</h1>
              <p className="text-[10px] uppercase tracking-[0.2em] opacity-60">Consultation Bookings</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium">{user.displayName}</p>
              <p className="text-[10px] opacity-60">{user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="flex gap-8 mb-12 border-b border-luxury-ink/5">
          <button 
            onClick={() => setActiveTab('consultations')}
            className={`pb-4 text-sm uppercase tracking-widest font-bold transition-all relative ${
              activeTab === 'consultations' ? 'text-luxury-gold' : 'text-luxury-ink/40 hover:text-luxury-ink'
            }`}
          >
            Consultations
            {activeTab === 'consultations' && (
              <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-luxury-gold" />
            )}
          </button>
          <button 
            onClick={() => setActiveTab('messages')}
            className={`pb-4 text-sm uppercase tracking-widest font-bold transition-all relative ${
              activeTab === 'messages' ? 'text-luxury-gold' : 'text-luxury-ink/40 hover:text-luxury-ink'
            }`}
          >
            Direct Messages
            {activeTab === 'messages' && (
              <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-luxury-gold" />
            )}
          </button>
        </div>

        {activeTab === 'consultations' ? (
          <>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
              <div>
                <h2 className="text-4xl font-serif mb-2">Bookings</h2>
                <p className="text-luxury-ink/60">Manage your consultation requests from the website.</p>
              </div>

              <div className="flex items-center gap-3 bg-white p-1 rounded-2xl shadow-sm border border-luxury-ink/5 overflow-x-auto no-scrollbar">
                {(['all', 'pending', 'contacted', 'completed', 'cancelled'] as const).map((stat) => (
                  <button
                    key={stat}
                    onClick={() => setFilter(stat)}
                    className={`px-5 py-2.5 rounded-xl text-xs uppercase tracking-widest font-bold transition-all ${
                      filter === stat 
                        ? 'bg-luxury-gold text-white shadow-md' 
                        : 'text-luxury-ink/40 hover:text-luxury-ink hover:bg-luxury-bg'
                    }`}
                  >
                    {stat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-6">
              <AnimatePresence mode="popLayout">
                {filteredConsultations.map((c) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={c.id}
                    className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-luxury-ink/5 hover:shadow-xl transition-shadow group"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center gap-8">
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-luxury-bg rounded-full flex items-center justify-center text-luxury-gold group-hover:bg-luxury-gold group-hover:text-white transition-colors">
                            <UserIcon className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="text-xl font-serif">{c.name}</h3>
                            <p className="text-xs uppercase tracking-widest text-luxury-ink/40">{c.service}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                          <div className="flex items-center gap-3 text-luxury-ink/70 bg-luxury-bg/50 px-4 py-2 rounded-xl">
                            <Phone className="w-4 h-4 text-luxury-gold" />
                            <span className="font-mono">{c.phone}</span>
                          </div>
                          <div className="flex items-center gap-3 text-luxury-ink/70 bg-luxury-bg/50 px-4 py-2 rounded-xl">
                            <Calendar className="w-4 h-4 text-luxury-gold" />
                            <span>{c.createdAt?.toDate().toLocaleString() || 'Just now'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 lg:border-l lg:border-luxury-ink/5 lg:pl-10">
                        <div className="w-full mb-2 lg:hidden">
                          <span className="text-[10px] uppercase tracking-widest opacity-40 font-bold">Update Status</span>
                        </div>
                        <button
                          onClick={() => updateStatus(c.id, 'pending')}
                          className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all ${
                            c.status === 'pending' ? 'bg-amber-500 text-white' : 'bg-amber-50 text-amber-600 hover:bg-amber-100'
                          }`}
                        >
                          <Clock className="w-3 h-3" /> Still Pending
                        </button>
                        <button
                          onClick={() => updateStatus(c.id, 'contacted')}
                          className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all ${
                            c.status === 'contacted' ? 'bg-blue-500 text-white' : 'bg-blue-5 text-blue-600 hover:bg-blue-100'
                          }`}
                        >
                          <Phone className="w-3 h-3" /> Contacted
                        </button>
                        <button
                          onClick={() => updateStatus(c.id, 'completed')}
                          className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all ${
                            c.status === 'completed' ? 'bg-emerald-500 text-white' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                          }`}
                        >
                          <CheckCircle className="w-3 h-3" /> Completed
                        </button>
                        <button
                          onClick={() => updateStatus(c.id, 'cancelled')}
                          className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all ${
                            c.status === 'cancelled' ? 'bg-red-500 text-white' : 'bg-red-50 text-red-600 hover:bg-red-100'
                          }`}
                        >
                          <XCircle className="w-3 h-3" /> Cancelled
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
                {filteredConsultations.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-24 text-center"
                  >
                    <div className="w-20 h-20 bg-luxury-bg rounded-full flex items-center justify-center mx-auto mb-6 text-luxury-ink/20">
                      <Filter className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-serif text-luxury-ink/40">No consultations found</h3>
                    <p className="text-luxury-ink/30">Try a different filter or check back later.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </>
        ) : (
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-serif mb-2">Messages</h2>
              <p className="text-luxury-ink/60">Direct inquiries from your contact form.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {messages.map((m) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    key={m.id}
                    className="bg-white p-6 rounded-3xl shadow-sm border border-luxury-ink/5 hover:shadow-lg transition-all"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-luxury-gold/10 rounded-full flex items-center justify-center text-luxury-gold">
                          <UserIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-lg font-serif">{m.name}</h4>
                          <p className="text-[10px] uppercase tracking-widest text-luxury-ink/40">
                            {m.createdAt?.toDate().toLocaleDateString() || 'Recently'}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-luxury-ink/70 text-sm mb-6 leading-relaxed bg-luxury-bg/50 p-4 rounded-2xl border border-luxury-ink/5 italic">
                      "{m.message}"
                    </p>
                    
                    <div className="space-y-2 pt-4 border-t border-luxury-ink/5">
                      <a href={`tel:${m.phone}`} className="flex items-center gap-3 text-xs text-luxury-ink/60 hover:text-luxury-gold transition-colors">
                        <Phone className="w-3 h-3" /> {m.phone}
                      </a>
                      <a href={`mailto:${m.email}`} className="flex items-center gap-3 text-xs text-luxury-ink/60 hover:text-luxury-gold transition-colors">
                        <Mail className="w-3 h-3" /> {m.email}
                      </a>
                    </div>
                  </motion.div>
                ))}
                {messages.length === 0 && (
                  <div className="col-span-full py-24 text-center">
                    <div className="w-20 h-20 bg-luxury-bg rounded-full flex items-center justify-center mx-auto mb-6 text-luxury-ink/20">
                      <MessageSquare className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-serif text-luxury-ink/40">No messages yet</h3>
                    <p className="text-luxury-ink/30">Form submissions will appear here.</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </main>

      <footer className="py-12 bg-white border-t border-luxury-ink/5 mt-24">
        <div className="container mx-auto px-6 text-center">
            <p className="text-[10px] uppercase tracking-[0.2em] opacity-40">Thakur Interior Studio • Private Admin Panel</p>
        </div>
      </footer>
    </div>
  );
}
