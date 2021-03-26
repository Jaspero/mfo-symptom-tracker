import {coerceBooleanProperty} from '@angular/cdk/coercion';
import {DOCUMENT} from '@angular/common';
import {
  AfterViewInit,
  Directive,
  ElementRef,
  Inject,
  Input
} from '@angular/core';

@Directive({
  selector: '[autofocus]'
})
export class AutoFocusDirective implements AfterViewInit {
  constructor(
    private readonly element: ElementRef,
    @Inject(DOCUMENT) document: HTMLDocument
  ) {
    if (typeof this.element.nativeElement.focus !== 'function') {
      throw new Error('Html element must be focusable');
    }
    this.host = element.nativeElement;
    this.focus = document.activeElement;
  }

  host: HTMLElement;
  focus: Element | null;
  autoFocus = true;

  @Input()
  set autofocus(value: boolean | string) {
    this.autoFocus = coerceBooleanProperty(value);
  }

  public ngAfterViewInit(): void {
    if (this.autoFocus && this.host && this.host !== this.focus) {
      setTimeout(() => this.element.nativeElement.focus());
    }
  }
}
