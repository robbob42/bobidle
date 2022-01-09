import { FeatureOpts } from './classes/Feature';

// Footer DOM
const cdsAlert = document.createElement('cds-alert');
cdsAlert.id = 'game-alert';
cdsAlert.setAttribute('status', '');
cdsAlert.innerHTML = '';
const footerDom = document.createElement('footer');
footerDom.className = 'body-footer';
footerDom.setAttribute('cds-layout', 'p-y:md p-x:lg');
footerDom.appendChild(cdsAlert);

type FeatureList = {
  [key: string]: FeatureOpts
}

export default {
  footer: {
    key: 'footer',
    parentId: 'feature-footer',
    domElement: footerDom,
    visible: true
  }
} as FeatureList