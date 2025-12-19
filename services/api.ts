
import { User, UserRole, Resume, ResumeStatus, DashboardStats, AuditLog } from '../types';

const USERS_KEY = 'rmp_users';
const RESUMES_KEY = 'rmp_resumes';
const LOGS_KEY = 'rmp_logs';
const SESSION_KEY = 'rmp_session';
const RESET_TOKENS_KEY = 'rmp_reset_tokens';

export const mockApiService = {
  // --- AUTH ---
  async login(email: string, password: string): Promise<User> {
    const users = this.getUsers() as (User & { password?: string })[];
    const user = users.find(u => u.email === email);
    
    // In our mock, if no password exists (legacy users), we check against 'password123'
    const storedPassword = user?.password || 'password123';
    
    if (!user || password !== storedPassword) {
      throw new Error('Invalid credentials');
    }
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    return user;
  },

  async register(userData: Partial<User & { password?: string }>): Promise<User> {
    const users = this.getUsers();
    if (users.find(u => u.email === userData.email)) {
      throw new Error('Email already registered');
    }
    
    const verificationToken = Math.random().toString(36).substr(2, 12);
    
    const newUser: User & { password?: string; verificationToken?: string } = {
      id: Math.random().toString(36).substr(2, 9),
      email: userData.email!,
      firstName: userData.firstName!,
      lastName: userData.lastName!,
      role: UserRole.USER,
      isVerified: false,
      password: userData.password || 'password123',
      verificationToken,
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    
    console.log(`[Verification Email Sent to ${newUser.email}]`);
    console.log(`Verification URL: http://localhost:3000/#/verify-email/${verificationToken}`);
    
    localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
    return newUser;
  },

  async requestPasswordReset(email: string): Promise<void> {
    const users = this.getUsers();
    const user = users.find(u => u.email === email);
    
    if (!user) {
      // For security, we don't always want to reveal if a user exists, 
      // but in this mock we'll throw to help the user.
      throw new Error('No account found with this email address');
    }
    
    const resetToken = Math.random().toString(36).substr(2, 12);
    const tokens = JSON.parse(localStorage.getItem(RESET_TOKENS_KEY) || '{}');
    tokens[resetToken] = { userId: user.id, expiry: Date.now() + 3600000 }; // 1 hour expiry
    localStorage.setItem(RESET_TOKENS_KEY, JSON.stringify(tokens));
    
    console.log(`[Password Reset Email Sent to ${email}]`);
    console.log(`Reset URL: http://localhost:3000/#/reset-password/${resetToken}`);
  },

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const tokens = JSON.parse(localStorage.getItem(RESET_TOKENS_KEY) || '{}');
    const resetData = tokens[token];
    
    if (!resetData || resetData.expiry < Date.now()) {
      throw new Error('Invalid or expired reset token');
    }
    
    const users = this.getUsers() as (User & { password?: string })[];
    const userIndex = users.findIndex(u => u.id === resetData.userId);
    
    if (userIndex === -1) throw new Error('User not found');
    
    users[userIndex].password = newPassword;
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    
    // Cleanup token
    delete tokens[token];
    localStorage.setItem(RESET_TOKENS_KEY, JSON.stringify(tokens));
    
    await this.logAction('PASSWORD_RESET', resetData.userId, resetData.userId, 'User reset their password');
  },

  async verifyEmail(token: string): Promise<boolean> {
    const users = this.getUsers() as (User & { verificationToken?: string })[];
    const userIndex = users.findIndex(u => u.verificationToken === token);
    
    if (userIndex === -1) {
      throw new Error('Invalid or expired verification token');
    }
    
    users[userIndex].isVerified = true;
    delete users[userIndex].verificationToken;
    
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    
    const session = localStorage.getItem(SESSION_KEY);
    if (session) {
      const currentSession = JSON.parse(session);
      if (currentSession.id === users[userIndex].id) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(users[userIndex]));
      }
    }
    
    return true;
  },

  async logout() {
    localStorage.removeItem(SESSION_KEY);
  },

  async getCurrentUser(): Promise<User | null> {
    const session = localStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
  },

  async updateProfile(userId: string, data: Partial<User>): Promise<User> {
    const users = this.getUsers();
    const idx = users.findIndex(u => u.id === userId);
    if (idx === -1) throw new Error('User not found');
    users[idx] = { ...users[idx], ...data };
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    localStorage.setItem(SESSION_KEY, JSON.stringify(users[idx]));
    return users[idx];
  },

  // --- RESUMES ---
  async getResumes(filters?: { userId?: string, status?: ResumeStatus }): Promise<Resume[]> {
    let resumes = JSON.parse(localStorage.getItem(RESUMES_KEY) || '[]');
    if (filters?.userId) resumes = resumes.filter((r: Resume) => r.userId === filters.userId);
    if (filters?.status) resumes = resumes.filter((r: Resume) => r.status === filters.status);
    return resumes;
  },

  async getResumeById(id: string): Promise<Resume | null> {
    const resumes = await this.getResumes();
    return resumes.find(r => r.id === id) || null;
  },

  async createResume(resumeData: Partial<Resume>): Promise<Resume> {
    const resumes = await this.getResumes();
    const newResume: Resume = {
      id: Math.random().toString(36).substr(2, 9),
      userId: resumeData.userId!,
      personalInfo: resumeData.personalInfo!,
      education: resumeData.education || [],
      experience: resumeData.experience || [],
      skills: resumeData.skills || [],
      certifications: resumeData.certifications || [],
      status: ResumeStatus.DRAFT,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...resumeData
    };
    resumes.push(newResume);
    localStorage.setItem(RESUMES_KEY, JSON.stringify(resumes));
    await this.logAction('CREATE_RESUME', newResume.userId, newResume.id, 'Created new resume draft');
    return newResume;
  },

  async updateResume(id: string, data: Partial<Resume>): Promise<Resume> {
    const resumes = await this.getResumes();
    const idx = resumes.findIndex(r => r.id === id);
    if (idx === -1) throw new Error('Resume not found');
    resumes[idx] = { ...resumes[idx], ...data, updatedAt: new Date().toISOString() };
    localStorage.setItem(RESUMES_KEY, JSON.stringify(resumes));
    return resumes[idx];
  },

  async deleteResume(id: string): Promise<void> {
    const resumes = await this.getResumes();
    const filtered = resumes.filter(r => r.id !== id);
    localStorage.setItem(RESUMES_KEY, JSON.stringify(filtered));
  },

  // --- ADMIN ---
  async getAllUsers(): Promise<User[]> {
    return this.getUsers();
  },

  async getDashboardStats(): Promise<DashboardStats> {
    const users = await this.getAllUsers();
    const resumes = await this.getResumes();
    
    const skillsMap: Record<string, number> = {};
    resumes.forEach(r => r.skills.forEach(s => skillsMap[s] = (skillsMap[s] || 0) + 1));
    const skillsData = Object.entries(skillsMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    return {
      totalUsers: users.length,
      totalResumes: resumes.length,
      submittedToday: resumes.filter(r => new Date(r.createdAt).toDateString() === new Date().toDateString()).length,
      avgExperienceYears: 4.2,
      skillsData,
      submissionsByDay: [
        { day: 'Mon', count: 4 },
        { day: 'Tue', count: 7 },
        { day: 'Wed', count: 12 },
        { day: 'Thu', count: 9 },
        { day: 'Fri', count: 15 },
        { day: 'Sat', count: 5 },
        { day: 'Sun', count: 3 },
      ]
    };
  },

  async getAuditLogs(): Promise<AuditLog[]> {
    return JSON.parse(localStorage.getItem(LOGS_KEY) || '[]');
  },

  // --- HELPERS ---
  getUsers(): User[] {
    const users = localStorage.getItem(USERS_KEY);
    if (!users) {
      const defaultAdmin: User & { password?: string } = {
        id: 'admin-1',
        email: 'admin@resumanage.in',
        firstName: 'Aditya',
        lastName: 'Verma',
        role: UserRole.ADMIN,
        isVerified: true,
        password: 'password123',
        createdAt: new Date().toISOString()
      };
      const initial = [defaultAdmin];
      localStorage.setItem(USERS_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(users);
  },

  async logAction(action: string, userId: string, targetId: string, details: string) {
    const logs = await this.getAuditLogs();
    const newLog: AuditLog = {
      id: Math.random().toString(36).substr(2, 9),
      action,
      performedBy: userId,
      targetId,
      details,
      timestamp: new Date().toISOString()
    };
    logs.unshift(newLog);
    localStorage.setItem(LOGS_KEY, JSON.stringify(logs.slice(0, 100)));
  }
};
