import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({ selector: 'app-add-edit-banner', standalone: true, imports: [RouterLink], template: `<a routerLink="/admin/banners">← Back to banners list</a>` })
export class AddEditBannerComponent {}
