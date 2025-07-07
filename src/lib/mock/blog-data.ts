import { BlogPost } from "@/lib/firebase/blog-service";

export const mockBlogPosts: BlogPost[] = [
    {
        id: "blog-post-1",
        title: "Traditional Wedding Ceremonies Around the World",
        content: JSON.stringify([
            {
                id: "b3a873a0-3873-496a-ac1e-e7f1d9c1b26f",
                type: "image",
                props: {
                    backgroundColor: "default",
                    textAlignment: "left",
                    name: "",
                    url: "https://res.cloudinary.com/dvfk4g3wh/image/upload/v1745561694/6e5835b8f5b6089981b3ec7f602e69302a7b73f3_eabge6.jpg",
                    caption: "Traditional Haldi ceremony with friends and family",
                    showPreview: true,
                    previewWidth: 794
                },
                children: []
            },
            {
                id: "cc82f766-00d3-472d-bc9c-676313518e4e",
                type: "heading",
                props: {
                    textColor: "default",
                    backgroundColor: "default",
                    textAlignment: "left",
                    level: 1
                },
                content: [
                    {
                        type: "text",
                        text: "The Beauty of Cultural Wedding Traditions",
                        styles: {}
                    }
                ],
                children: []
            },
            {
                id: "e429565c-932b-4c89-b125-411f47c7f20e",
                type: "paragraph",
                props: {
                    textColor: "default",
                    backgroundColor: "default",
                    textAlignment: "left"
                },
                content: [
                    {
                        type: "text",
                        text: "Weddings are a universal celebration of love, but the traditions and ceremonies vary widely across different cultures and regions. From the vibrant colors of Indian weddings to the solemn vows of Western ceremonies, each tradition carries deep cultural significance and beauty.",
                        styles: {}
                    }
                ],
                children: []
            }
        ]),
        imageUrl: "https://res.cloudinary.com/dvfk4g3wh/image/upload/v1745561694/6e5835b8f5b6089981b3ec7f602e69302a7b73f3_eabge6.jpg",
        isPublished: true,
        eventSlug: "wedding",
        userId: "user123",
        createdAt: new Date("2023-08-01T09:00:00Z"),
        updatedAt: new Date("2023-08-01T09:00:00Z"),
        publishedAt: new Date("2023-08-01T09:00:00Z")
    },
    {
        id: "blog-post-2",
        title: "Modern Alternatives to Traditional Vows",
        content: JSON.stringify([
            {
                id: "c4a873a0-3873-496a-ac1e-e7f1d9c1b26f",
                type: "image",
                props: {
                    backgroundColor: "default",
                    textAlignment: "left",
                    name: "",
                    url: "https://res.cloudinary.com/dvfk4g3wh/image/upload/v1745561691/b17c9b1fcaa81fcfecac9d6ee52cfd20ae77424d_uijm0z.jpg",
                    caption: "A beautiful wedding ceremony setup",
                    showPreview: true,
                    previewWidth: 794
                },
                children: []
            },
            {
                id: "cc82f766-00d3-472d-bc9c-676313518e4f",
                type: "heading",
                props: {
                    textColor: "default",
                    backgroundColor: "default",
                    textAlignment: "left",
                    level: 1
                },
                content: [
                    {
                        type: "text",
                        text: "Personalizing Your Wedding Vows",
                        styles: {}
                    }
                ],
                children: []
            },
            {
                id: "e429565c-932b-4c89-b125-411f47c7f21e",
                type: "paragraph",
                props: {
                    textColor: "default",
                    backgroundColor: "default",
                    textAlignment: "left"
                },
                content: [
                    {
                        type: "text",
                        text: "More couples are choosing to write their own wedding vows, creating deeply personal promises that reflect their unique relationship. This beautiful trend allows for genuine expression of love and commitment beyond traditional vow formats.",
                        styles: {}
                    }
                ],
                children: []
            }
        ]),
        imageUrl: "https://res.cloudinary.com/dvfk4g3wh/image/upload/v1745561691/b17c9b1fcaa81fcfecac9d6ee52cfd20ae77424d_uijm0z.jpg",
        isPublished: true,
        eventSlug: "wedding",
        userId: "user123",
        createdAt: new Date("2023-08-02T10:15:00Z"),
        updatedAt: new Date("2023-08-02T10:15:00Z"),
        publishedAt: new Date("2023-08-02T10:15:00Z")
    },
    {
        id: "blog-post-3",
        title: "Eco-Friendly Wedding Ceremony Ideas",
        content: JSON.stringify([
            {
                id: "d5a873a0-3873-496a-ac1e-e7f1d9c1b26f",
                type: "image",
                props: {
                    backgroundColor: "default",
                    textAlignment: "left",
                    name: "",
                    url: "https://res.cloudinary.com/dvfk4g3wh/image/upload/v1745561665/fbab0d3b57f25ca88851e8c4d25ddbd9250e7f56_znbobn.jpg",
                    caption: "Nature-inspired wedding decoration",
                    showPreview: true,
                    previewWidth: 794
                },
                children: []
            },
            {
                id: "cc82f766-00d3-472d-bc9c-676313518e5e",
                type: "heading",
                props: {
                    textColor: "default",
                    backgroundColor: "default",
                    textAlignment: "left",
                    level: 1
                },
                content: [
                    {
                        type: "text",
                        text: "Sustainable Wedding Planning",
                        styles: {}
                    }
                ],
                children: []
            },
            {
                id: "e429565c-932b-4c89-b125-411f47c7f22e",
                type: "paragraph",
                props: {
                    textColor: "default",
                    backgroundColor: "default",
                    textAlignment: "left"
                },
                content: [
                    {
                        type: "text",
                        text: "For environmentally conscious couples, planning a sustainable wedding is becoming increasingly important. With thoughtful choices, you can create a beautiful celebration that reflects your values and reduces environmental impact.",
                        styles: {}
                    }
                ],
                children: []
            }
        ]),
        imageUrl: "https://res.cloudinary.com/dvfk4g3wh/image/upload/v1745561665/fbab0d3b57f25ca88851e8c4d25ddbd9250e7f56_znbobn.jpg",
        isPublished: true,
        eventSlug: "wedding",
        userId: "user123",
        createdAt: new Date("2023-08-03T11:30:00Z"),
        updatedAt: new Date("2023-08-03T11:30:00Z"),
        publishedAt: new Date("2023-08-03T11:30:00Z")
    },
    {
        id: "blog-post-4",
        title: "Incorporating Cultural Elements in a Mixed-Heritage Ceremony",
        content: JSON.stringify([
            {
                id: "e6a873a0-3873-496a-ac1e-e7f1d9c1b26f",
                type: "image",
                props: {
                    backgroundColor: "default",
                    textAlignment: "left",
                    name: "",
                    url: "https://res.cloudinary.com/dvfk4g3wh/image/upload/v1745558782/47d82ed6e9cf55cc338fd6f844f4261f79797e97_ikzww9.jpg",
                    caption: "Fusion of traditional elements in a modern wedding",
                    showPreview: true,
                    previewWidth: 794
                },
                children: []
            },
            {
                id: "cc82f766-00d3-472d-bc9c-676313518e6e",
                type: "heading",
                props: {
                    textColor: "default",
                    backgroundColor: "default",
                    textAlignment: "left",
                    level: 1
                },
                content: [
                    {
                        type: "text",
                        text: "Honoring Multiple Cultural Traditions",
                        styles: {}
                    }
                ],
                children: []
            },
            {
                id: "e429565c-932b-4c89-b125-411f47c7f23e",
                type: "paragraph",
                props: {
                    textColor: "default",
                    backgroundColor: "default",
                    textAlignment: "left"
                },
                content: [
                    {
                        type: "text",
                        text: "Incorporating cultural elements into your wedding is a beautiful way to honor your heritage and create a meaningful celebration that reflects your roots. These traditions connect your marriage to the generations that came before you.",
                        styles: {}
                    }
                ],
                children: []
            }
        ]),
        imageUrl: "https://res.cloudinary.com/dvfk4g3wh/image/upload/v1745558782/47d82ed6e9cf55cc338fd6f844f4261f79797e97_ikzww9.jpg",
        isPublished: true,
        eventSlug: "wedding",
        userId: "user123",
        createdAt: new Date("2023-08-04T13:45:00Z"),
        updatedAt: new Date("2023-08-04T13:45:00Z"),
        publishedAt: new Date("2023-08-04T13:45:00Z")
    },
    {
        id: "haldi-significance-001",
        title: "The Cultural Significance of Haldi Ceremony in Indian Weddings",
        content: JSON.stringify([
            {
                id: "g7a873a0-3873-496a-ac1e-e7f1d9c1b26f",
                type: "image",
                props: {
                    backgroundColor: "default",
                    textAlignment: "left",
                    name: "",
                    url: "https://res.cloudinary.com/dvfk4g3wh/image/upload/v1745561694/6e5835b8f5b6089981b3ec7f602e69302a7b73f3_eabge6.jpg",
                    caption: "Traditional Haldi ceremony with family applying turmeric paste",
                    showPreview: true,
                    previewWidth: 794
                },
                children: []
            },
            {
                id: "cc82f766-00d3-472d-bc9c-676313518e7e",
                type: "heading",
                props: {
                    textColor: "default",
                    backgroundColor: "default",
                    textAlignment: "left",
                    level: 1
                },
                content: [
                    {
                        type: "text",
                        text: "The Beauty and Significance of Haldi",
                        styles: {}
                    }
                ],
                children: []
            },
            {
                id: "e429565c-932b-4c89-b125-411f47c7f24e",
                type: "paragraph",
                props: {
                    textColor: "default",
                    backgroundColor: "default",
                    textAlignment: "left"
                },
                content: [
                    {
                        type: "text",
                        text: "The Haldi ceremony is one of the most important pre-wedding rituals in Indian tradition. This vibrant yellow turmeric paste is applied to both the bride and groom, preparing them for their new beginning together.",
                        styles: {}
                    }
                ],
                children: []
            }
        ]),
        imageUrl: "https://res.cloudinary.com/dvfk4g3wh/image/upload/v1745561694/6e5835b8f5b6089981b3ec7f602e69302a7b73f3_eabge6.jpg",
        isPublished: true,
        eventSlug: "haldi",
        userId: "user123",
        createdAt: new Date("2023-06-15T09:00:00Z"),
        updatedAt: new Date("2023-06-15T09:00:00Z"),
        publishedAt: new Date("2023-06-15T09:00:00Z")
    },
    {
        id: "haldi-traditions-002",
        title: "Traditional Haldi Rituals and Their Modern Adaptations",
        content: JSON.stringify([
            {
                id: "h8a873a0-3873-496a-ac1e-e7f1d9c1b26f",
                type: "image",
                props: {
                    backgroundColor: "default",
                    textAlignment: "left",
                    name: "",
                    url: "https://res.cloudinary.com/dvfk4g3wh/image/upload/v1745561691/b17c9b1fcaa81fcfecac9d6ee52cfd20ae77424d_uijm0z.jpg",
                    caption: "Modern Haldi celebration with friends",
                    showPreview: true,
                    previewWidth: 794
                },
                children: []
            },
            {
                id: "cc82f766-00d3-472d-bc9c-676313518e8e",
                type: "heading",
                props: {
                    textColor: "default",
                    backgroundColor: "default",
                    textAlignment: "left",
                    level: 1
                },
                content: [
                    {
                        type: "text",
                        text: "Traditional and Modern Haldi Celebrations",
                        styles: {}
                    }
                ],
                children: []
            },
            {
                id: "e429565c-932b-4c89-b125-411f47c7f25e",
                type: "paragraph",
                props: {
                    textColor: "default",
                    backgroundColor: "default",
                    textAlignment: "left"
                },
                content: [
                    {
                        type: "text",
                        text: "Traditionally, the Haldi ceremony involves mixing turmeric powder with milk, sandalwood paste, and rose water to create a paste that is applied to the bride and groom's face, neck, hands, and feet.",
                        styles: {}
                    }
                ],
                children: []
            }
        ]),
        imageUrl: "https://res.cloudinary.com/dvfk4g3wh/image/upload/v1745561691/b17c9b1fcaa81fcfecac9d6ee52cfd20ae77424d_uijm0z.jpg",
        isPublished: true,
        eventSlug: "haldi",
        userId: "user123",
        createdAt: new Date("2023-06-16T09:00:00Z"),
        updatedAt: new Date("2023-06-16T09:00:00Z"),
        publishedAt: new Date("2023-06-16T09:00:00Z")
    },
    {
        id: "haldi-recipes-003",
        title: "Traditional Haldi Recipes for the Perfect Ceremony",
        content: JSON.stringify([
            {
                id: "i9a873a0-3873-496a-ac1e-e7f1d9c1b26f",
                type: "image",
                props: {
                    backgroundColor: "default",
                    textAlignment: "left",
                    name: "",
                    url: "https://res.cloudinary.com/dvfk4g3wh/image/upload/v1745561665/fbab0d3b57f25ca88851e8c4d25ddbd9250e7f56_znbobn.jpg",
                    caption: "Traditional ingredients for Haldi paste",
                    showPreview: true,
                    previewWidth: 794
                },
                children: []
            },
            {
                id: "cc82f766-00d3-472d-bc9c-676313518e9e",
                type: "heading",
                props: {
                    textColor: "default",
                    backgroundColor: "default",
                    textAlignment: "left",
                    level: 1
                },
                content: [
                    {
                        type: "text",
                        text: "Creating the Perfect Haldi Paste",
                        styles: {}
                    }
                ],
                children: []
            },
            {
                id: "e429565c-932b-4c89-b125-411f47c7f26e",
                type: "paragraph",
                props: {
                    textColor: "default",
                    backgroundColor: "default",
                    textAlignment: "left"
                },
                content: [
                    {
                        type: "text",
                        text: "The perfect Haldi paste is more than just turmeric powder and water. Traditional recipes include a mix of ingredients that enhance both the cosmetic and aromatic properties of the paste.",
                        styles: {}
                    }
                ],
                children: []
            }
        ]),
        imageUrl: "https://res.cloudinary.com/dvfk4g3wh/image/upload/v1745561665/fbab0d3b57f25ca88851e8c4d25ddbd9250e7f56_znbobn.jpg",
        isPublished: true,
        eventSlug: "haldi",
        userId: "user123",
        createdAt: new Date("2023-06-17T09:00:00Z"),
        updatedAt: new Date("2023-06-17T09:00:00Z"),
        publishedAt: new Date("2023-06-17T09:00:00Z")
    },
    {
        id: "haldi-outfits-004",
        title: "What to Wear: Perfect Outfits for the Haldi Ceremony",
        content: JSON.stringify([
            {
                id: "j0a873a0-3873-496a-ac1e-e7f1d9c1b26f",
                type: "image",
                props: {
                    backgroundColor: "default",
                    textAlignment: "left",
                    name: "",
                    url: "https://res.cloudinary.com/dvfk4g3wh/image/upload/v1745558782/47d82ed6e9cf55cc338fd6f844f4261f79797e97_ikzww9.jpg",
                    caption: "Colorful traditional outfits for Haldi ceremony",
                    showPreview: true,
                    previewWidth: 794
                },
                children: []
            },
            {
                id: "cc82f766-00d3-472d-bc9c-676313518f0e",
                type: "heading",
                props: {
                    textColor: "default",
                    backgroundColor: "default",
                    textAlignment: "left",
                    level: 1
                },
                content: [
                    {
                        type: "text",
                        text: "Styling for Your Haldi Ceremony",
                        styles: {}
                    }
                ],
                children: []
            },
            {
                id: "e429565c-932b-4c89-b125-411f47c7f27e",
                type: "paragraph",
                props: {
                    textColor: "default",
                    backgroundColor: "default",
                    textAlignment: "left"
                },
                content: [
                    {
                        type: "text",
                        text: "Choosing the right outfit for a Haldi ceremony requires practical consideration, as the yellow turmeric paste will likely stain your clothes. This is actually part of the fun and tradition!",
                        styles: {}
                    }
                ],
                children: []
            }
        ]),
        imageUrl: "https://res.cloudinary.com/dvfk4g3wh/image/upload/v1745558782/47d82ed6e9cf55cc338fd6f844f4261f79797e97_ikzww9.jpg",
        isPublished: true,
        eventSlug: "haldi",
        userId: "user123",
        createdAt: new Date("2023-06-18T09:00:00Z"),
        updatedAt: new Date("2023-06-18T09:00:00Z"),
        publishedAt: new Date("2023-06-18T09:00:00Z")
    },
    {
        id: "haldi-decor-005",
        title: "Beautiful Décor Ideas for Your Haldi Ceremony",
        content: JSON.stringify([
            {
                id: "k1a873a0-3873-496a-ac1e-e7f1d9c1b26f",
                type: "image",
                props: {
                    backgroundColor: "default",
                    textAlignment: "left",
                    name: "",
                    url: "https://res.cloudinary.com/dvfk4g3wh/image/upload/v1745561694/6e5835b8f5b6089981b3ec7f602e69302a7b73f3_eabge6.jpg",
                    caption: "Vibrant yellow and orange marigold decorations",
                    showPreview: true,
                    previewWidth: 794
                },
                children: []
            },
            {
                id: "cc82f766-00d3-472d-bc9c-676313518f1e",
                type: "heading",
                props: {
                    textColor: "default",
                    backgroundColor: "default",
                    textAlignment: "left",
                    level: 1
                },
                content: [
                    {
                        type: "text",
                        text: "Creating a Vibrant Haldi Setting",
                        styles: {}
                    }
                ],
                children: []
            },
            {
                id: "e429565c-932b-4c89-b125-411f47c7f28e",
                type: "paragraph",
                props: {
                    textColor: "default",
                    backgroundColor: "default",
                    textAlignment: "left"
                },
                content: [
                    {
                        type: "text",
                        text: "The Haldi ceremony provides a wonderful opportunity to create a vibrant, colorful setting that reflects the joyous nature of this pre-wedding ritual.",
                        styles: {}
                    }
                ],
                children: []
            }
        ]),
        imageUrl: "https://res.cloudinary.com/dvfk4g3wh/image/upload/v1745561694/6e5835b8f5b6089981b3ec7f602e69302a7b73f3_eabge6.jpg",
        isPublished: true,
        eventSlug: "haldi",
        userId: "user123",
        createdAt: new Date("2023-06-19T09:00:00Z"),
        updatedAt: new Date("2023-06-19T09:00:00Z"),
        publishedAt: new Date("2023-06-19T09:00:00Z")
    }
];

export default mockBlogPosts; 