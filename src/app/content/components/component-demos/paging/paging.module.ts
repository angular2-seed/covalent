import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes, Route } from '@angular/router';

import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

import { ComponentDetailsModule } from 'app/components/shared/component-details/component-details.module';
import { CovalentBreadcrumbsModule } from '@covalent/core/breadcrumbs';
import { setComponentRoutes } from 'app/components/components/components';
import { PagingDemoComponent } from './paging.component';

const routes: Routes = setComponentRoutes({
  overviewDemoComponent: PagingDemoComponent,
  id: 'breadcrumbs',
});

@NgModule({
  declarations: [PagingDemoComponent],
  imports: [
    CommonModule,
    // Material
    MatSelectModule,
    MatIconModule,
    ComponentDetailsModule,
    // Covalent
    CovalentBreadcrumbsModule,
    // Docs
    // Routes
    RouterModule.forChild(routes),
  ],
  exports: [],
  providers: [],
})
export class PagingDemoModule {}
