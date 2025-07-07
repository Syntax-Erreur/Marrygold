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
    Timestamp
} from "firebase/firestore";
import { db } from "../firebase";

export type PaymentStatus = "Pending" | "Paid" | "Overdue";

export interface Installment {
    amount: number;
    date: Date;
    status: PaymentStatus;
}

export interface PaymentData {
    paymentName: string;
    fullAmount: number;
    expectedInstallmentCount: number;
    firstPaymentStatus: string;
    eventSlug: string;
    currency: string;
    installments: Installment[];
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Payment extends PaymentData {
    id: string;
}

interface FirestorePayment extends Omit<PaymentData, 'createdAt' | 'updatedAt' | 'installments'> {
    installments: Array<{
        amount: number;
        date: Timestamp;
        status: "Pending" | "Paid" | "Overdue";
    }>;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export class PaymentService {
    private readonly collectionPath = "payments";

    private convertFromFirestore(doc: QueryDocumentSnapshot<DocumentData>): Payment {
        const data = doc.data() as FirestorePayment;
        return {
            id: doc.id,
            paymentName: data.paymentName,
            fullAmount: data.fullAmount,
            expectedInstallmentCount: data.expectedInstallmentCount,
            firstPaymentStatus: data.firstPaymentStatus,
            eventSlug: data.eventSlug,
            currency: data.currency || "$",
            installments: data.installments.map(inst => ({
                amount: inst.amount,
                date: inst.date.toDate(),
                status: inst.status
            })),
            createdAt: data.createdAt?.toDate(),
            updatedAt: data.updatedAt?.toDate()
        };
    }

    async createPayment(eventSlug: string, paymentData: Omit<PaymentData, 'eventSlug'>): Promise<Payment> {
        try {
            const { installments, ...rest } = paymentData;

            const firestoreData = {
                ...rest,
                eventSlug,
                currency: rest.currency || "$",
                installments: installments.map(inst => ({
                    amount: Number(inst.amount),
                    date: Timestamp.fromDate(new Date(inst.date)),
                    status: inst.status
                })),
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            };

            const docRef = await addDoc(
                collection(db, this.collectionPath),
                firestoreData
            );

            const docSnap = await getDoc(docRef);
            if (!docSnap.exists()) {
                throw new Error("Failed to create payment");
            }

            return this.convertFromFirestore(docSnap);
        } catch (error) {
            console.error("Error creating payment:", error);
            throw error;
        }
    }

    async getPayment(paymentId: string): Promise<Payment | null> {
        try {
            const docRef = doc(db, this.collectionPath, paymentId);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                return null;
            }

            return this.convertFromFirestore(docSnap);
        } catch (error) {
            console.error("Error getting payment:", error);
            throw error;
        }
    }

    async updatePayment(paymentId: string, paymentData: Partial<PaymentData>): Promise<Payment> {
        try {
            const docRef = doc(db, this.collectionPath, paymentId);

            const updates: any = {
                ...paymentData,
                updatedAt: serverTimestamp()
            };

            if (paymentData.installments) {
                updates.installments = paymentData.installments.map(inst => ({
                    amount: Number(inst.amount),
                    date: Timestamp.fromDate(new Date(inst.date)),
                    status: inst.status
                }));
            }

            await updateDoc(docRef, updates);

            const updatedDoc = await getDoc(docRef);
            if (!updatedDoc.exists()) {
                throw new Error("Failed to get updated payment");
            }

            return this.convertFromFirestore(updatedDoc);
        } catch (error) {
            console.error("Error updating payment:", error);
            throw error;
        }
    }

    async getAllPayments(eventSlug: string): Promise<Payment[]> {
        try {
            const q = query(
                collection(db, this.collectionPath),
                where("eventSlug", "==", eventSlug),
                orderBy("createdAt", "desc")
            );

            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => this.convertFromFirestore(doc));
        } catch (error) {
            console.error("Error getting payments:", error);
            throw error;
        }
    }
}

export const paymentService = new PaymentService(); 