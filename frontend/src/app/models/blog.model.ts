import { User } from './user.model';

export interface Blog {
    id: number;
    title: string;
    content: string;
    is_published: boolean;
    published_at: string | null;
    created_at: string;
    updated_at: string;
    user: {
        id: number;
        name: string;
    };
}

export interface BlogResponse {
    data: Blog[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
} 