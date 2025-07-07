import {
    collection,
    addDoc,
    updateDoc,
    doc,
    getDoc,
    getDocs,
    query,
    where,
    orderBy,
    serverTimestamp,
    DocumentData,
    QueryDocumentSnapshot,
    FieldValue
} from "firebase/firestore";
import { db, auth } from "../firebase";

export interface BlogPost {
    id: string;
    title: string;
    content: string;
    imageUrl?: string;
    isPublished: boolean;
    eventSlug: string;
    userId: string;
    createdAt?: Date;
    updatedAt?: Date;
    publishedAt?: Date | null;
}

interface CreateBlogPost extends Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt' | 'publishedAt' | 'userId'> {
    title: string;
    content: string;
    imageUrl?: string;
    isPublished: boolean;
    eventSlug: string;
}

interface FirestoreBlogPost {
    title: string;
    content: string;
    imageUrl?: string;
    isPublished: boolean;
    eventSlug: string;
    userId: string;
    createdAt: FieldValue;
    updatedAt: FieldValue;
    publishedAt: FieldValue | null;
}

type FirestoreUpdate = {
    title?: string;
    content?: string;
    imageUrl?: string;
    isPublished?: boolean;
    updatedAt: FieldValue;
    publishedAt?: FieldValue;
}

export class BlogService {
    private readonly collectionPath = "eventContent";

    private getCurrentUserId(): string {
        const user = auth.currentUser;
        if (!user) throw new Error("No authenticated user");
        return user.uid;
    }

    private convertTimestamps(doc: QueryDocumentSnapshot<DocumentData>): BlogPost {
        const data = doc.data();
        return {
            id: doc.id,
            title: data.title || "Untitled",
            content: data.content || "",
            imageUrl: data.imageUrl,
            isPublished: data.isPublished || false,
            eventSlug: data.eventSlug,
            userId: data.userId,
            createdAt: data.createdAt?.toDate(),
            updatedAt: data.updatedAt?.toDate(),
            publishedAt: data.publishedAt?.toDate()
        };
    }

    async createPost(eventSlug: string, postData: CreateBlogPost): Promise<BlogPost> {
        try {
            const userId = this.getCurrentUserId();

            const blogData: FirestoreBlogPost = {
                title: postData.title,
                content: postData.content,
                imageUrl: postData.imageUrl,
                isPublished: postData.isPublished || false,
                eventSlug,
                userId,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                publishedAt: postData.isPublished ? serverTimestamp() : null
            };

            const docRef = await addDoc(
                collection(db, this.collectionPath),
                blogData
            );

            return {
                id: docRef.id,
                ...postData,
                userId,
                eventSlug,
                createdAt: new Date(),
                updatedAt: new Date(),
                publishedAt: postData.isPublished ? new Date() : null
            };
        } catch (error) {
            console.error("Error creating blog post:", error);
            throw error;
        }
    }

    async getPost(eventId: string, postId: string): Promise<BlogPost | null> {
        try {
            const userId = this.getCurrentUserId();
            const docRef = doc(db, this.collectionPath, postId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const post = this.convertTimestamps(docSnap);
                if (post.userId === userId) {
                    return post;
                }
            }
            return null;
        } catch (error) {
            console.error("Error getting blog post:", error);
            throw error;
        }
    }

    async updatePost(eventId: string, postId: string, postData: Partial<BlogPost>): Promise<BlogPost> {
        try {
            const docRef = doc(db, this.collectionPath, postId);

            const updates: FirestoreUpdate = {
                updatedAt: serverTimestamp()
            };

            if (postData.title !== undefined) updates.title = postData.title;
            if (postData.content !== undefined) updates.content = postData.content;
            if (postData.imageUrl !== undefined) updates.imageUrl = postData.imageUrl;
            if (postData.isPublished !== undefined) updates.isPublished = postData.isPublished;

            if (postData.isPublished === true) {
                const docSnap = await getDoc(docRef);
                const data = docSnap.data();

                if (!data?.publishedAt) {
                    updates.publishedAt = serverTimestamp();
                }
            }

            await updateDoc(docRef, updates);

            const updatedPost = await this.getPost(eventId, postId);
            if (!updatedPost) {
                throw new Error("Failed to get updated post");
            }

            return updatedPost;
        } catch (error) {
            console.error("Error updating blog post:", error);
            throw error;
        }
    }

    async togglePublishStatus(eventId: string, postId: string, isPublished: boolean): Promise<BlogPost> {
        try {
            const docRef = doc(db, this.collectionPath, postId);
            const updates: FirestoreUpdate = {
                isPublished,
                updatedAt: serverTimestamp()
            };

            if (isPublished) {
                const docSnap = await getDoc(docRef);
                const data = docSnap.data();

                if (!data?.publishedAt) {
                    updates.publishedAt = serverTimestamp();
                }
            }

            await updateDoc(docRef, updates);

            const updatedPost = await this.getPost(eventId, postId);
            if (!updatedPost) {
                throw new Error("Failed to get updated post");
            }

            return updatedPost;
        } catch (error) {
            console.error("Error toggling publish status:", error);
            throw error;
        }
    }

    async getAllPosts(eventSlug: string, onlyPublished = false): Promise<BlogPost[]> {
        try {
            const userId = this.getCurrentUserId();

            const q = query(
                collection(db, this.collectionPath),
                where("userId", "==", userId),
                where("eventSlug", "==", eventSlug),
                orderBy("updatedAt", "desc")
            );

            const querySnapshot = await getDocs(q);
            const posts = querySnapshot.docs.map(doc => this.convertTimestamps(doc));

            return onlyPublished ? posts.filter(post => post.isPublished) : posts;
        } catch (error) {
            console.error("Error getting blog posts:", error);
            throw error;
        }
    }
}

export const blogService = new BlogService(); 