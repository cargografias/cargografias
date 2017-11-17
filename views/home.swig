{% extends 'clean-layout.html' %}

{% block title %}
Cargografías
{% endblock %}

{% block head %}
  {% parent %}


  <link rel="stylesheet" href="css/normalize.css" type="text/css">
  <link rel="stylesheet" href="css/flexboxgrid.min.css" type="text/css">
  <link rel="stylesheet" href="css/newlanding.css" type="text/css">



{% endblock %}

{% block content %}

<div id="home-container" class="">
  <div id="home-1" class="">
  <div class="row">
    <div class="col-xs-12
          col-sm-12
          col-md-12
          col-lg-12
          logotype">
        <div><img src="/img/v2/logo.png" alt=""></div>
        <p class="choise-place">Seleccionar instancia:</p>
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
                <a href="/paraguay"><img src="/img/v2/paraguay.png" alt="">
                    <br>Paraguay</a>
            </li>
        </ul>
    </div>
    <div class="col-xs-12 text">
    <p>Cargografías es una línea de tiempo que muestra los cargos públicos que tuvo cada funcionario a lo largo de su vida. </p>
    <div class="about-us">
      <img src="/img/v2/about.png" alt="">
      <a target="_blank" href="https://medium.com/@Cargografias/como-nace-cargografias-e82510388040">ACERCA DE </a>
    </div>
    </div>
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
</div>

<script>
  new WOW().init();
  </script>
{% endblock %}
