import { db } from './firebase-init.js';
import {
    collection,
    onSnapshot,
    query,
    where,
    orderBy,
    Timestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

class StatsService {
    constructor() {
        this.listeners = [];
        this.stats = {
            totalUsers: 0,
            totalMaterials: 0,
            totalForumPosts: 0,
            activeToday: 0
        };
        this.callbacks = [];
    }

    // Subscribe to stats updates
    subscribe(callback) {
        this.callbacks.push(callback);
        // Immediately call with current stats
        callback(this.stats);
    }

    // Unsubscribe from stats updates
    unsubscribe(callback) {
        this.callbacks = this.callbacks.filter(cb => cb !== callback);
    }

    // Notify all subscribers
    notifySubscribers() {
        this.callbacks.forEach(callback => callback(this.stats));
    }

    // Start listening to all collections for real-time updates
    startListening() {
        this.listenToUsers();
        this.listenToMaterials();
        this.listenToForumPosts();
        this.listenToActiveUsers();
    }

    // Stop all listeners
    stopListening() {
        this.listeners.forEach(unsubscribe => unsubscribe());
        this.listeners = [];
    }

    // Listen to users collection
    listenToUsers() {
        const usersQuery = collection(db, 'users');
        const unsubscribe = onSnapshot(usersQuery, (snapshot) => {
            this.stats.totalUsers = snapshot.size;
            this.notifySubscribers();
        }, (error) => {
            console.error('Error listening to users:', error);
            // Set to 0 if permission denied
            this.stats.totalUsers = 0;
            this.notifySubscribers();
        });
        this.listeners.push(unsubscribe);
    }

    // Listen to materials collection
    listenToMaterials() {
        const materialsQuery = collection(db, 'materials');
        const unsubscribe = onSnapshot(materialsQuery, (snapshot) => {
            this.stats.totalMaterials = snapshot.size;
            this.notifySubscribers();
        }, (error) => {
            console.error('Error listening to materials:', error);
            // Set to 0 if permission denied
            this.stats.totalMaterials = 0;
            this.notifySubscribers();
        });
        this.listeners.push(unsubscribe);
    }

    // Listen to forum posts
    listenToForumPosts() {
        const forumQuery = collection(db, 'posts'); // Changed from 'forum' to 'posts'
        const unsubscribe = onSnapshot(forumQuery, (snapshot) => {
            this.stats.totalForumPosts = snapshot.size;
            this.notifySubscribers();
        }, (error) => {
            console.error('Error listening to forum posts:', error);
            // Set to 0 if permission denied
            this.stats.totalForumPosts = 0;
            this.notifySubscribers();
        });
        this.listeners.push(unsubscribe);
    }

    // Listen to active users today (users who logged in today)
    listenToActiveUsers() {
        // Get start of today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const startOfDay = Timestamp.fromDate(today);

        // Query users who have lastLoginAt >= start of today
        const activeUsersQuery = query(
            collection(db, 'users'),
            where('lastLoginAt', '>=', startOfDay)
        );

        const unsubscribe = onSnapshot(activeUsersQuery, (snapshot) => {
            this.stats.activeToday = snapshot.size;
            this.notifySubscribers();
        }, (error) => {
            console.error('Error listening to active users:', error);
            // If the field doesn't exist yet or permission denied, set to 0
            this.stats.activeToday = 0;
            this.notifySubscribers();
        });
        this.listeners.push(unsubscribe);
    }

    // Get current stats (synchronous)
    getCurrentStats() {
        return { ...this.stats };
    }

    // Update user's last login timestamp (call this when user logs in)
    async updateUserLastLogin(userId) {
        try {
            const { doc, updateDoc, serverTimestamp } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
            const userRef = doc(db, 'users', userId);
            await updateDoc(userRef, {
                lastLoginAt: serverTimestamp()
            });
        } catch (error) {
            console.error('Error updating user last login:', error);
        }
    }
}

// Create singleton instance
const statsService = new StatsService();

export default statsService;
export { StatsService };
