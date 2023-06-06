import Alpine from 'alpinejs';
document.addEventListener('alpine:init', () => {

    Alpine.store('navigation',{
        isMenuOpen: null,
        toggleMenuOpen(){
            this.isMenuOpen = !this.isMenuOpen;
        },
        resetVariables(windowSize) {
            if (windowSize > 750) {
              this.isMenuOpen = null;
            }
          },
    })
})

window.Alpine = Alpine;
Alpine.start();