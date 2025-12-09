import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FilmService } from '../../services/film.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [MatButtonModule, CommonModule, MatProgressSpinnerModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomePageComponent {
  private filmService = inject(FilmService);

  // Загружаем фильмы как Observable → преобразуем в сигнал
  movies = toSignal(this.filmService.getMovies(), { initialValue: [] as string[] });
  
  // Сигнал выбранного фильма
  selectedMovie = signal<string | null>(null);
  isLoading = signal(false);

  pickRandomMovie() {
    const list = this.movies();
    if (list.length === 0  || this.isLoading()) return;

    const random = list[Math.floor(Math.random() * list.length)];

    this.isLoading.set(true);

    this.filmService.incrementViews(random).subscribe({
      next: () => {
        this.selectedMovie.set(random);
        this.isLoading.set(false);
      },
      error: (err: Error) => {
        console.error('Ошибка при обновлении просмотров', err);
        this.isLoading.set(false);
      }
    });
  }
}
