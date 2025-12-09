// src/app/services/film.service.ts
import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { from, map, Observable, switchMap } from 'rxjs';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class FilmService {
   private supabase: SupabaseClient;

  constructor(private supabaseService: SupabaseService) {
    this.supabase = this.supabaseService.getClient()
  }

  // Получить все фильмы
  getMovies(): Observable<string[]> {
    return from(
      this.supabase?.from('movies')
        .select('title')
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data.map(item => item.title);
      })
    );
  }

  // Добавить фильм
  addMovie(title: string): Observable<void> {
    return from(
      this.supabase
        .from('movies')
        .insert({ title })
    ).pipe(
      map(({ error }) => {
        if (error && !error.message.includes('duplicate')) {
          throw error;
        }
      })
    );
  }

   incrementViews(title: string): Observable<void> {
    return from(
      this.supabase.from('movies').select('views').eq('title', title).single()
    ).pipe(
      switchMap(({ data, error }) => {
        if (error) throw error;
        return from(
          this.supabase
            .from('movies')
            .update({ views: (data?.views || 0) + 1 })
            .eq('title', title)
        );
      }),
      map(() => void 0)
    );
  }
}