{% extends 'clean-layout.html' %}

{% block title %}
Cargografías
{% endblock %}

{% block head %}
  {% parent %}
     <!-- CSS
  –––––––––––––––––––––––––––––––––––––––––––––––––– -->
  {# <link rel="stylesheet" href="css/normalize.css">
  <link rel="stylesheet" href="css/skeleton.css">
  <link rel="stylesheet" href="css/custom.css">
  <link rel="stylesheet" href="bower_components/wowjs/css/libs/animate.css">
  <link rel="stylesheet" href="css/font-awesome.min.css"> #}
  <link rel="stylesheet" href="css/normalize.css" type="text/css">
  <link rel="stylesheet" href="css/flexboxgrid.min.css" type="text/css">
  <link rel="stylesheet" href="css/newlanding.css" type="text/css">

  <!-- Scripts
  –––––––––––––––––––––––––––––––––––––––––––––––––– -->
  {# <script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
  <link rel="stylesheet" href="css/github-prettify-theme.css">
  <script src="bower_components/wowjs/dist/wow.min.js"></script> #}

{% endblock %}

{% block content %}
    {# <div class="container">
    <section class="header">
        <h1 > <img src="/img/logo.png"> </h1>

      <p>Cargografías es una línea de tiempo que muestra los cargos públicos que tuvo cada funcionario a lo largo de su vida. Es una fuente de consulta que busca facilitar el análisis y comprensión de la historia reciente</p>
      <div class=" row">
        <div class="three columns value-prop">
            <a href="/cargografias">
        <img class="flag" src="https://lipis.github.io/flag-icon-css/flags/1x1/ar.svg" alt="Bandera Argentina">
          <p>Argentina</p>
            </a>
        </div>
        <div class="three columns value-prop">
            <a href="/brasil">
        <img class="flag" src="https://lipis.github.io/flag-icon-css/flags/1x1/br.svg" alt="Bandera Brasil">
            <p>Brasil</p>
            </a>

        </div>
        <div class="three columns value-prop">
            <a href="/uruguay">
         <img class="flag" src="https://lipis.github.io/flag-icon-css/flags/1x1/uy.svg" alt="Bandera Uruguay">
          <p>Uruguay</p>
            </a>
        </div>
         <div class="three columns value-prop">
            <a href="/paraguay">
<img class="flag" src="https://lipis.github.io/flag-icon-css/flags/1x1/py.svg" alt="Bandera Paraguay">
           <p>Paraguay</p>
       </a>
        </div>
      </div>

    </section>
<div class="section values">
    <div class="container">
      <div class="row">

        <div class="one-half column">
           <h2 class="section-heading">¿Tenés un informacion para contribuir? </h2>
      <p class="section-description">Cargografías busca expandir la plataforma.
    </p>
      <a class="button button-primary" href="https://docs.google.com/forms/d/1NoOYENvhHXqpLO3WpB8l6R8ofJkJiShLlx2A_DfrNd0/viewform?embedded=true&amp;hl=es">Escribinos  <i class="fa fa-envelope-o"
             aria-hidden="true"></i></a>
        </div>
        <div class="one-half column social">
          <div class="value-props row">

          <div class="one-half column value">
            <h1 ><a href="https://github.com/cargografias" target="_blank"<i class="fa fa-github" aria-hidden="true"></i></a></h1> <h1><a href="https://twitter.com/intent/follow?original_referer=http%3A%2F%2Flocalhost%3A3000%2F&region=follow_link&screen_name=Cargografias&tw_p=followbutton&variant=2.0" target="_blank"><i class="fa fa-twitter" aria-hidden="true"></i></a></h1>
          </div>
           <div class="one-half column value">
            <h1 ><a href="http://www.google.com/recaptcha/mailhide/d?k=01C7lOvjG_N7EaBpT3Yp2Lmw==&amp;c=so8gSuVp-5Xe2ocyAzNPdAZ8Uq5kd15DyhceyfZw3qY=" onclick="window.open('http://www.google.com/recaptcha/mailhide/d?k\07501C7lOvjG_N7EaBpT3Yp2Lmw\75\75\46c\75so8gSuVp-5Xe2ocyAzNPdAZ8Uq5kd15DyhceyfZw3qY\075', '', 'toolbar=0,scrollbars=0,location=0,statusbar=0,menubar=0,resizable=0,width=500,height=300'); return false;" title="Reveal this e-mail address"><i class="fa fa-envelope-o"></i></a></h1>
            <h1 ><a id="ordenNombre" target="_blank" href="https://docs.google.com/forms/d/1NoOYENvhHXqpLO3WpB8l6R8ofJkJiShLlx2A_DfrNd0/viewform?embedded=true&amp;hl=es">
                        <i class="fa fa-exclamation-triangle"></i></a></h1>

          </div>
          </div>
        </div>

      </div>
    </div>
    <p> <small>El contenido está disponible bajo la licencia la licencia Creative Commons Atribución-CompartirIgual 4.0 Internacional </small> </p>
  </div>
  </div>
</p> #}
{# <script>
  new WOW().init();
  </script> #}

  <div class="row">
    <div class="col-xs-12
          col-sm-12
          col-md-12
          col-lg-12
          logotype">
        <div><img src="/img/v2/logo.png" alt=""></div>
    </div>
</div>

<div class="row ">
    <div class="col-xs-12
            col-sm-12
            col-md-12
            col-lg-12
            choise-places">
        <ul>
            <li>
                <a href="/cargografias"><img src="/img/v2/argentina.png" alt="">
                    <br>Argentina</a>
            </li>
            <li>
                <a href="/brasil"><img src="/img/v2/brazil.png" alt="">
                    <br>Brasil</a>
            </li>
            <li>
                <a href="/uruguay"><img src="/img/v2/uruguay.png" alt="">
                    <br>Uruguay</a>
            </li>
            <li>
                <a href="/mexico"><img src="/img/v2/mexico.png" alt="">
                    <br>Mexico</a>
            </li>
            <li>
                <a href="/venezuela"><img src="/img/v2/venezuela.png" alt="">
                    <br>Venezuela</a>
            </li>
            <li>
                <a href="/paraguay"><img src="/img/v2/paraguay.png" alt="">
                    <br>Paraguay</a>
            </li>
        </ul>
    </div>
</div>

<!-- <div ng-view></div> -->


<div class="row footer">
    <div class="col-xs-12
          col-sm-12
          col-md-4
          col-lg-4
          column-1">
        <ul>
            <li>
                <a href="#"><img src="/img/v2/facebook.png" alt=""></a>
            </li>
            <li>
                <a href="https://twitter.com/intent/follow?original_referer=http%3A%2F%2Flocalhost%3A3000%2F&region=follow_link&screen_name=Cargografias&tw_p=followbutton&variant=2.0" target="_blank"><img src="/img/v2/twitter.png" alt=""></a>
            </li>
            <li>
                <a href="https://github.com/cargografias" target="_blank"><img src="/img/v2/github.png" alt=""></a>
            </li>
            <li>
                <a href="https://docs.google.com/forms/d/1NoOYENvhHXqpLO3WpB8l6R8ofJkJiShLlx2A_DfrNd0/viewform?embedded=true&amp;hl=es" target="_blank"><img src="/img/v2/mail.png" alt=""></a>
            </li>
        </ul>
    </div>

    <div class="col-xs-12
          col-sm-12
          col-md-4
          col-lg-4
          column-2">
        <p>Cargografías es una línea de tiempo que muestra los cargos públicos que tuvo cada funcionario a lo largo de su vida. También utilizada como herramienta de consulta ya que facilita el análisis y comprensión de la historia reciente.</p>
        <ul>
            <li>
                <a href="#"><img src="/img/v2/icon1.png" alt=""></a>
            </li>
            <li>
                <a href="#"><img src="/img/v2/icon2.png" alt=""></a>
            </li>
            <li>
                <a href="#"><img src="/img/v2/icon3.png" alt=""></a>
            </li>
        </ul>
    </div>
    <div class="col-xs-12
          col-sm-12
          col-md-4
          col-lg-4
          column-3">
        <a href="https://docs.google.com/forms/d/1NoOYENvhHXqpLO3WpB8l6R8ofJkJiShLlx2A_DfrNd0/viewform?embedded=true&amp;hl=es" target="_blank"><img src="/img/v2/icon4.png" alt="">
            <p>AYUDANOS A MEJORAR</p>
        </a>
    </div>
</div>

<script>
  new WOW().init();
  </script>
{% endblock %}
