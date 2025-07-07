import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase';

export const DEFAULT_EVENTS = [
    {
        name: 'haldi',
        tag: 'Pre-Wedding',
        tables: 4,
        peoplePerTable: 6,
        themeColorIndex: 0,
        totalCapacity: 24,
        totalBudget: 5000,
        totalSpending: 0,
        isDefault: true
    },
    {
        name: 'sangeeth',
        tag: 'Pre-Wedding',
        tables: 6,
        peoplePerTable: 8,
        themeColorIndex: 1,
        totalCapacity: 48,
        totalBudget: 8000,
        totalSpending: 0,
        isDefault: true
    },
    {
        name: 'engagement',
        tag: 'Pre-Wedding',
        tables: 8,
        peoplePerTable: 8,
        themeColorIndex: 2,
        totalCapacity: 64,
        totalBudget: 10000,
        totalSpending: 0,
        isDefault: true
    }
];

export async function setupDefaultEventsForUser(userId: string) {
    try {
        const existingQuery = query(
            collection(db, 'events'),
            where('userId', '==', userId),
            where('isDefault', '==', true)
        );

        const snapshot = await getDocs(existingQuery);

        if (!snapshot.empty) {
            return;
        }

        const promises = DEFAULT_EVENTS.map(event =>
            addDoc(collection(db, 'events'), {
                ...event,
                userId,
                createdAt: new Date().toISOString()
            })
        );

        await Promise.all(promises);
        console.log('Default events created for user:', userId);
    } catch (error) {
        console.error('Error setting up default events:', error);
        throw error;
    }
} 