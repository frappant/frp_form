export default class Spinner {

  static show($button) {
    $button.style.display = 'none';
    const classes = $button.className.split(' ');
    const newButton = document.createElement('button');
    newButton.className = classes.join(' ');
    newButton.id = 'crazy-spinner-id';
    newButton.type = 'submit';
    newButton.disabled = true;

    newButton.innerHTML = '<span class="spinner-border spinner-border-sm mx-3" role="status" aria-hidden="true"></span>';
    $button.parentNode.insertBefore(newButton, $button.nextSibling);
  }

  static hide($button) {
    document.querySelector('#crazy-spinner-id').remove();
    $button.style.display = 'block';
  }

}
