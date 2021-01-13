import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ColorUtils } from '../../utils/colors';
import { FilterService } from '../../services/filter.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-store-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class StoreFilterComponent implements OnInit, OnDestroy {

  private subs = new Subscription();

  currSelected: string;
  availableColors: string[];
  visible = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private service: FilterService) {
    this.service.setColor(this.currSelected);
  }

  ngOnInit() {
    this.subs.add(
      this.service.initProducts$.subscribe(result => {
        this.availableColors = ColorUtils.getAvailableColors(result);
      })
    );
    this.subs.add(
      this.service.initColor$.subscribe(result => {
        this.currSelected = result;
      })
    );
    this.subs.add(
      this.service.initVisibility$.subscribe(result => {
        this.visible = result;
      })
    );
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  changeSelected(color: string) {
    if (this.currSelected === color) {
      this.currSelected = null;
    } else {
      this.currSelected = color;
    }
    this.service.setColor(this.currSelected);
    this.UpdateQueryParam();
  }

  private UpdateQueryParam() {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { color: this.currSelected }
    });
  }

  reset() {
    this.currSelected = null;
    this.service.setColor(this.currSelected);
    this.UpdateQueryParam();
  }

}
