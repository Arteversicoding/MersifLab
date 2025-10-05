import { db } from './firebase-init.js';
import {
    collection,
    query,
    where,
    getDocs,
    onSnapshot,
    Timestamp,
    orderBy
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

class UserStatsService {
    constructor() {
        this.listeners = [];
        this.userStats = {
            activeDays: 0,
            completedProjects: 0,
            averageRating: 0,
            totalForumPosts: 0,
            totalMaterialsViewed: 0
        };
        this.callbacks = [];
    }

    // Subscribe to user stats updates
    subscribe(callback) {
        this.callbacks.push(callback);
        // Immediately call with current stats
        callback(this.userStats);
    }

    // Unsubscribe from stats updates
    unsubscribe(callback) {
        this.callbacks = this.callbacks.filter(cb => cb !== callback);
    }

    // Notify all subscribers
    notifySubscribers() {
        this.callbacks.forEach(callback => callback(this.userStats));
    }

    // Calculate user statistics
    async calculateUserStats(userId) {
        if (!userId) {
            this.userStats = {
                activeDays: 0,
                completedProjects: 0,
                averageRating: 0,
                totalForumPosts: 0,
                totalMaterialsViewed: 0
            };
            this.notifySubscribers();
            return;
        }

        try {
            // Calculate active days (days since registration)
            await this.calculateActiveDays(userId);
            
            // Calculate forum posts by user
            await this.calculateForumPosts(userId);
            
            // Calculate completed projects (materials viewed/downloaded)
            await this.calculateCompletedProjects(userId);
            
            // Calculate average rating (based on activity level)
            this.calculateAverageRating();
            
            this.notifySubscribers();
        } catch (error) {
            console.error('Error calculating user stats:', error);
        }
    }

    // Calculate active days since registration
    async calculateActiveDays(userId) {
        try {
            const { doc, getDoc } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
            const userDoc = await getDoc(doc(db, 'users', userId));
            
            if (userDoc.exists()) {
                const userData = userDoc.data();
                const createdAt = userData.createdAt;
                
                if (createdAt) {
                    const now = new Date();
                    const registrationDate = createdAt.toDate ? createdAt.toDate() : new Date(createdAt);
                    const diffTime = Math.abs(now - registrationDate);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    this.userStats.activeDays = diffDays;
                } else {
                    // Fallback: assume registered recently
                    this.userStats.activeDays = 1;
                }
            }
        } catch (error) {
            console.error('Error calculating active days:', error);
            this.userStats.activeDays = 1;
        }
    }

    // Calculate forum posts by user
    async calculateForumPosts(userId) {
        try {
            const forumQuery = query(
                collection(db, 'posts'),
                where('authorId', '==', userId)
            );
            
            const forumSnapshot = await getDocs(forumQuery);
            this.userStats.totalForumPosts = forumSnapshot.size;
        } catch (error) {
            console.error('Error calculating forum posts:', error);
            this.userStats.totalForumPosts = 0;
        }
    }

    // Calculate completed projects (estimate based on activity)
    async calculateCompletedProjects(userId) {
        try {
            // For now, we'll estimate based on forum posts and time active
            // In the future, you could track actual project completions
            const baseProjects = Math.floor(this.userStats.totalForumPosts / 3); // 1 project per 3 posts
            const timeBonus = Math.floor(this.userStats.activeDays / 30); // 1 project per month
            
            this.userStats.completedProjects = Math.max(baseProjects + timeBonus, 0);
        } catch (error) {
            console.error('Error calculating completed projects:', error);
            this.userStats.completedProjects = 0;
        }
    }

    // Calculate average rating based on activity
    calculateAverageRating() {
        try {
            // Calculate rating based on activity level
            let rating = 3.0; // Base rating
            
            // Bonus for forum activity
            if (this.userStats.totalForumPosts > 0) {
                rating += Math.min(this.userStats.totalForumPosts * 0.1, 1.0);
            }
            
            // Bonus for being active longer
            if (this.userStats.activeDays > 7) {
                rating += Math.min(this.userStats.activeDays / 100, 0.8);
            }
            
            // Bonus for completed projects
            if (this.userStats.completedProjects > 0) {
                rating += Math.min(this.userStats.completedProjects * 0.05, 0.5);
            }
            
            // Cap at 5.0
            this.userStats.averageRating = Math.min(rating, 5.0);
        } catch (error) {
            console.error('Error calculating average rating:', error);
            this.userStats.averageRating = 3.0;
        }
    }

    // Start real-time listening for user stats
    startListening(userId) {
        if (!userId) return;

        // Listen to forum posts changes
        const forumQuery = query(
            collection(db, 'posts'),
            where('authorId', '==', userId)
        );
        
        const unsubscribeForumPosts = onSnapshot(forumQuery, (snapshot) => {
            this.userStats.totalForumPosts = snapshot.size;
            this.calculateCompletedProjects(userId);
            this.calculateAverageRating();
            this.notifySubscribers();
        }, (error) => {
            console.error('Error listening to forum posts:', error);
        });

        this.listeners.push(unsubscribeForumPosts);

        // Initial calculation
        this.calculateUserStats(userId);
    }

    // Stop all listeners
    stopListening() {
        this.listeners.forEach(unsubscribe => unsubscribe());
        this.listeners = [];
    }

    // Get current stats (synchronous)
    getCurrentStats() {
        return { ...this.userStats };
    }

    // Format stats for display
    getFormattedStats() {
        return {
            activeDays: this.userStats.activeDays,
            completedProjects: this.userStats.completedProjects,
            averageRating: this.userStats.averageRating.toFixed(1)
        };
    }
}

// Create singleton instance
const userStatsService = new UserStatsService();

export default userStatsService;
export { UserStatsService };
