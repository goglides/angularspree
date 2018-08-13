import { Component, OnInit, Input, EventEmitter, Output, PLATFORM_ID, Inject } from '@angular/core';
import { Variant } from './../../../../core/models/variant';
import { VariantRetriverService } from './../../../../core/services/variant-retriver.service';
import { VariantParserService } from './../../../../core/services/variant-parser.service';
import { Taxon } from '../../../../core/models/taxon';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-product-price-info',
  templateUrl: './product-price-info.component.html',
  styleUrls: ['./product-price-info.component.scss']
})
export class ProductPriceInfoComponent implements OnInit {
  @Input() product;
  @Input() isMobile;
  @Input() brand: Taxon;
  @Output() onAddToCart = new EventEmitter<Object>();
  @Output() onMarkAsFavorites = new EventEmitter<Object>();
  @Output() selectedVariant = new EventEmitter<Object>();


  customOptionTypesHash: any;
  currentSelectedOptions = {};
  description: any;
  images: any;
  mainOptions: any;
  correspondingOptions: any;
  variantId: any;
  selectedVariantPrice: any;
  isOrderable: boolean;

  constructor(private variantParser: VariantParserService,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
   }

  ngOnInit() {
    this.images = this.product.images;
    this.variantId = this.product.id;
    // this.customOptionTypesHash = this.variantParser
    // .getOptionsToDisplay(this.product.variants, this.product.option_types);
    // this.mainOptions = this.makeGlobalOptinTypesHash(this.customOptionTypesHash);
    // this.correspondingOptions = this.mainOptions;
    this.isOrderable = this.product.is_orderable;
  }

  // onOptionClick(option) {
  //   const result = new VariantRetriverService().getVariant(
  //     this.currentSelectedOptions,
  //     this.customOptionTypesHash,
  //     option,
  //     this.product,
  //   );

  //   this.createNewCorrespondingOptions(
  //     result.newCorrespondingOptions,
  //     option.value.optionValue.option_type_name
  //   );

  //   this.currentSelectedOptions = result.newSelectedoptions;
  //   const newVariant: Variant = result.variant;
  //   this.variantId = newVariant.id;
  //   this.description = newVariant.description;
  //   this.images = newVariant.images;
  //   this.product.display_price = result.variant.display_price
  //   this.getSelectedVariant(result.variant);
  //   this.isOrderable = newVariant.is_orderable;
  //   this.product.master.cost_price = newVariant.cost_price;
  //   this.product.price = newVariant.price;
  // }

  makeGlobalOptinTypesHash(customOptionTypes) {
    const temp = {};
    for (const key in customOptionTypes) {
      if (customOptionTypes.hasOwnProperty(key)) {
        temp[key] = Object.keys(customOptionTypes[key]);
      }
    }
    return temp;
  }

  createNewCorrespondingOptions(newOptions, optionKey) {
    for (const key in this.correspondingOptions) {
      if (this.correspondingOptions.hasOwnProperty(key) && key !== optionKey) {
        this.correspondingOptions[key] = newOptions[key];
      }
    }
  }

  addToCart(event) {
    this.onAddToCart.emit(event)
  }

  markAsFavorites() {
    this.onMarkAsFavorites.emit()
  }

  getSelectedVariant(variant) {
    this.selectedVariant.emit(variant)
  }

  get discount() {
    return Math.ceil(+this.product.selling_price.amount - +this.product.max_retail_price.amount);
  }

  get discountPercent() {
    return `${Math.ceil(this.discount / +this.product.selling_price.amount * 100)}%`;
  }

  scrollToReview() {
    if (isPlatformBrowser(this.platformId)) {
      document.getElementById('review').scrollIntoView({ behavior: 'smooth' });
    }
  }
}
