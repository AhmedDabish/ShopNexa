import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({ selector: 'app-add-edit-category', standalone: true, imports: [RouterLink], template: `<p>Use page <a routerLink="/admin/categories">Categories list</a> for adding and editing</p>` })
export class AddEditCategoryComponent {}
