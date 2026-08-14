(function () {

  function initPurelaneHero(root) {

    if (!root) return;


    const slides =
      root.querySelectorAll('.pl-product-slide');

    const dots =
      root.querySelectorAll('.pl-product-dot');


    /*
      Nothing to animate if there are no slides.
    */

    if (!slides.length) {
      return;
    }


    /*
      If Shopify's Theme Editor reloads the section,
      make sure we don't leave old timers/listeners.
    */

    if (root.__purelaneHeroCleanup) {
      root.__purelaneHeroCleanup();
    }


    let current = 0;

    let timer = null;


    function showSlide(index) {

      if (index < 0) {
        index = slides.length - 1;
      }

      if (index >= slides.length) {
        index = 0;
      }


      current = index;


      slides.forEach(function (slide, i) {

        const active =
          i === current;

        slide.classList.toggle(
          'is-active',
          active
        );

        slide.setAttribute(
          'aria-hidden',
          active ? 'false' : 'true'
        );

      });


      dots.forEach(function (dot, i) {

        const active =
          i === current;

        dot.classList.toggle(
          'is-active',
          active
        );

        dot.setAttribute(
          'aria-pressed',
          active ? 'true' : 'false'
        );

      });

    }


    function stopAutoplay() {

      if (timer) {

        clearInterval(timer);

        timer = null;
      }

    }


    function startAutoplay() {

      stopAutoplay();


      /*
        Respect the user's reduced-motion preference.
      */

      if (
        window.matchMedia(
          '(prefers-reduced-motion: reduce)'
        ).matches
      ) {

        return;
      }


      /*
        Don't autoplay if there is only one slide.
      */

      if (slides.length <= 1) {

        return;
      }


      timer = setInterval(
        function () {

          showSlide(
            current + 1
          );

        },
        5000
      );

    }


    /*
      Dot navigation.
    */

    const dotHandlers = [];


    dots.forEach(function (dot) {

      const handler =
        function () {

          const index =
            Number(
              this.dataset.productIndex
            );


          if (
            Number.isNaN(index)
          ) {

            return;
          }


          showSlide(index);

          startAutoplay();

        };


      dot.addEventListener(
        'click',
        handler
      );


      dotHandlers.push({
        element: dot,
        handler: handler
      });

    });


    /*
      Pause when the browser tab is hidden.
    */

    function handleVisibilityChange() {

      if (document.hidden) {

        stopAutoplay();

      } else {

        startAutoplay();

      }

    }


    document.addEventListener(
      'visibilitychange',
      handleVisibilityChange
    );


    /*
      Initial state.
    */

    showSlide(0);

    startAutoplay();


    /*
      Cleanup function.
      Shopify Theme Editor can re-render
      the section without a full page reload.
    */

    root.__purelaneHeroCleanup =
      function () {

        stopAutoplay();


        document.removeEventListener(
          'visibilitychange',
          handleVisibilityChange
        );


        dotHandlers.forEach(
          function (item) {

            item.element.removeEventListener(
              'click',
              item.handler
            );

          }
        );

      };

  }


  /*
    Find all Purelane Hero sections.
  */

  function initAllPurelaneHeroes() {

    document
      .querySelectorAll('.pl-page')
      .forEach(function (root) {

        initPurelaneHero(root);

      });

  }


  /*
    Normal page load.
  */

  if (
    document.readyState === 'loading'
  ) {

    document.addEventListener(
      'DOMContentLoaded',
      initAllPurelaneHeroes
    );

  } else {

    initAllPurelaneHeroes();

  }


  /*
    Shopify Theme Editor.
  */

  document.addEventListener(
    'shopify:section:load',
    function (event) {

      const section =
        event.target;


      const root =
        section.querySelector
          ? section.querySelector('.pl-page')
          : null;


      if (root) {

        initPurelaneHero(root);

      }

    }
  );


  /*
    Shopify Theme Editor section unload.
  */

  document.addEventListener(
    'shopify:section:unload',
    function (event) {

      const root =
        event.target.querySelector
          ? event.target.querySelector('.pl-page')
          : null;


      if (
        root &&
        root.__purelaneHeroCleanup
      ) {

        root.__purelaneHeroCleanup();

      }

    }
  );

})();