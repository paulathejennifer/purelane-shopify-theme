(function () {

  function initPurelaneReviews(root) {

    if (!root) {
      return;
    }


    /*
      Clean up a previous Theme Editor initialization.
    */

    if (root.__purelaneReviewsCleanup) {
      root.__purelaneReviewsCleanup();
    }


    const track =
      root.querySelector('.pl-reviews__track');


    if (!track) {
      return;
    }


    const mediaQuery =
      window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      );


    function updateMotionPreference() {

      if (mediaQuery.matches) {

        track.style.animationPlayState = 'paused';

      } else {

        track.style.animationPlayState = '';

      }

    }


    updateMotionPreference();


    /*
      Some browsers expose addEventListener
      on MediaQueryList, older ones use addListener.
    */

    if (
      typeof mediaQuery.addEventListener === 'function'
    ) {

      mediaQuery.addEventListener(
        'change',
        updateMotionPreference
      );

    } else if (
      typeof mediaQuery.addListener === 'function'
    ) {

      mediaQuery.addListener(
        updateMotionPreference
      );

    }


    root.__purelaneReviewsCleanup =
      function () {

        if (
          typeof mediaQuery.removeEventListener === 'function'
        ) {

          mediaQuery.removeEventListener(
            'change',
            updateMotionPreference
          );

        } else if (
          typeof mediaQuery.removeListener === 'function'
        ) {

          mediaQuery.removeListener(
            updateMotionPreference
          );

        }

        track.style.animationPlayState = '';

      };

  }


  function initAllPurelaneReviews() {

    document
      .querySelectorAll('.pl-reviews')
      .forEach(function (root) {

        initPurelaneReviews(root);

      });

  }


  if (
    document.readyState === 'loading'
  ) {

    document.addEventListener(
      'DOMContentLoaded',
      initAllPurelaneReviews
    );

  } else {

    initAllPurelaneReviews();

  }


  /*
    Shopify Theme Editor section load.
  */

  document.addEventListener(
    'shopify:section:load',
    function (event) {

      const section =
        event.target;


      const root =
        section.querySelector
          ? section.querySelector('.pl-reviews')
          : null;


      if (root) {

        initPurelaneReviews(root);

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
          ? event.target.querySelector('.pl-reviews')
          : null;


      if (
        root &&
        root.__purelaneReviewsCleanup
      ) {

        root.__purelaneReviewsCleanup();

      }

    }
  );

})();