import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export interface FiltersState {
    genres: Set<string>;
    tags: Set<string>;
    setGenres: (genres: string[]) => void;
    setTags: (tags: string[]) => void;
    setTag: (tag: string) => void;
    setGenre: (genres: string) => void;


}

export const useFilters = create<FiltersState, [["zustand/immer", never]]>(
    immer(
    (set, get) => ({
        genres: new Set<string>(),
        tags: new Set<string>(),
        setTag(tag: string) {
            set({
                tags: new Set(this.tags).add(tag)
            })
        },
        setGenre(genre: string) {
            set({
                genres: new Set(this.genres).add(genre)
            })
        },
        setTags(tags) {
            set({
                tags: new Set(tags)
            })
        },
        setGenres(genres) {
            set({
                genres: new Set(genres)
            });
        },
    })
  ),
)
