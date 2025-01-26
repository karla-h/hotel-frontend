import { Injectable } from '@angular/core';
import { PopupComponent } from '../../shared/components/popup/popup.component';

@Injectable({
  providedIn: 'root'
})
export class PopupService {

  private popupComponent = new PopupComponent;
  
  constructor() { }
  
  setPopupComponent(popup: any) {
    this.popupComponent = popup;
  }

  showModal(message: string, title: string = '¡Registro exitoso!') {
    if (this.popupComponent) {
      this.popupComponent.message = message;
      this.popupComponent.title = title;
      this.popupComponent.showSuccessModal();
    } else {
      console.error('PopupComponent no está configurado.');
    }
  }
}
