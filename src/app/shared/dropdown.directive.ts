import { Directive, ElementRef, HostBinding, HostListener } from "@angular/core";

@Directive({
    selector: '[appDropdown]'
})
export class DropdownDirective {

    // 'open' is a CSS property that can open a dropdown
    // initalize it to false so it opens upon clicking
    @HostBinding('class.open')isOpen = false;
    // listen to the click event to toggle the dropdown menu
    @HostListener('click') toggleOpen() {
        this.isOpen = !this.isOpen;
    }


    // the code below allows the dropdown menu to close upon clicking anywhere
        // notice the listener is placed on the document rather than the dropdown
    // @HostListener('document:click', ['$event']) toggleOpen(event: Event) {
    //     this.isOpen = this.elRef.nativeElement.contains(event.target) ? !this.isOpen : false;
    // }
    // constructor(private elRef: ElementRef) {}
}