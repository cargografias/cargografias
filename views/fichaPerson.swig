{% extends 'layout.html' %}

{% block title %}
    {{person.name}} - Ficha @ Cargografías.org
{% endblock %}

{% block head %}
  {% parent %}
 
{% endblock %}

{% block content %}

    <div class="main">
        <div ng-view="" id="cargoContainer" class="ng-scope">
<div class="module timeline full-version embed">
          <a href="http://www.cargografias.org" class="boton"><i class="fa fa-reply"></i> Ir a la Versi&oacute;n Completa </a>
          <a id="ordenNombre" target="_blank" class="boton" href="https://docs.google.com/forms/d/1NoOYENvhHXqpLO3WpB8l6R8ofJkJiShLlx2A_DfrNd0/viewform?embedded=true&hl=es" >
                        <i class="fa fa-exclamation-triangle"></i>Reportar Errores</a>
          
</div>
            <div class="module ng-scope">

        <div class="description">
            Fichas Personales
        </div>
             <div class="main ficha">
                  <div class="items-personales image"><a href="{{person.image_original}}" target="_blank"><img src="{{person.image}}" /><br><small>{{person.image_original}}</small></a></div>
                  <div class="items-personales data">
                      <h1>{{person.name}}</h1>
                      {% if person.other_names %}
                      <i>({% for o_n in person.other_names %}{{o_n.name}}, {% endfor %})</i>
                      {% endif %}
                      <ul>

                       {% if person.birth_date %}<li><b>Nacimiento: </b><span class="format-fecha">{{person.birth_date}}</span>, {{person.birth_place}}</li>{% endif %}
                       {% if person.death_date %}<li><b>Muerte: </b><span class="format-fecha">{{person.birth_date}}</span>, {{person.death_place}}</li>{% endif %}
                       {% if person.biography %}<li><b>Bio: </b> {{person.biography}} </li>{% endif %}
                       {% for contactInfo in person.contact_details %}
                          <li><a href="{{contactInfo.value}}">
                                      {% if contactInfo.type=='twitter' %}<i class="fa fa-twitter"></i>{% endif %}
                                      {% if contactInfo.type=='facebook' %}<i class="fa fa-facebook"></i>{% endif %}
                                      {{contactInfo.label}}</a></li>
                       {% endfor %}

                      </ul>
                      
                    
               
                  </div>
                  <div style="clear: both;"></div>
                    <table class="table table-condensed">
                        <tbody>
                            <tr>
                                <th>Cargo</th>
                                <th>Organizaci&oacute;n</th>
                                <th>Territorio</th>                                
                                <th>Comienzo</th>
                                <th>Fin</th>
                                <th>Class</th>
                                <th>Type</th>
                                
                            </tr>

        {% for k, m in person.memberships %}

                            <tr ng-repeat="m in row.memberships">
                                <td>{{m.role}}</td>
                                <td><a target="_blank" class="organization load-organization" data-organization-id="{{m.organization_id}}" data-instance-name="{{instanceName}}" href="/{{instanceName}}/organization/{{m.organization_id}}">{{m.organization_id}}</a></td>
                                <td>{{m.area.name}}</td>                                
                                <td><span class="format-fecha">{{m.start_date}}</span><a href="#notas" class="nota">[{{k+1}}a]</a></td>
                                <td>{% if m.end_date %}<span class="format-fecha">{{m.end_date}}</span><a href="#notas" class="nota">[{{k+1}}b]</a>{% endif %}</td>
                                <td>{{m.class}}</td>
                                <td>{{m.type}}</td>
                                
                                
                            </tr>
        {% endfor %}

                        
                        </tbody>
                    </table>
                    <div id="notas">
                        {% for k, m in person.memberships %}
                                {% for d, source in m.sources %}
                                  [{{k+1}}
                                      {% if d %}b{% else %}a{% endif %}]Dato {{source.quality}} &mdash; {{source.source}}{% if source.source_url %} &mdash; <a href="{{source.source_url}}">{{source.source_url}}</a>{% endif %} | &nbsp;
                                  {% endfor %}<Br>
                        {% endfor %}
                    </div>

    </div>
        </div>
    </div>

<script>
  $('.load-organization').each(function(ix, el){
    var instanceName = $(el).attr('data-instance-name')
    var organizationId = $(el).attr('data-organization-id')
    var url = "https://" + instanceName + "/api/v0.1/organizations/" + organizationId
    $(el).html('Loading...')
    $.getJSON(url, function(data){
      $(el).html(data.result.name)
    })
  })

  var parts3 = /^\d\d\d\d-\d\d-\d\d$/
  var parts2 = /^\d\d\d\d-\d\d$/
  $('.format-fecha').each(function(ix, el){
    var content = $(el).html();
    if(parts3.test(content)){
      $(el).html( moment(content, "YYYY-MM-DD").format('DD MMM YYYY') ) 
    }else if(parts2.test(content)){
      $(el).html( moment(content, "YYYY-MM").format('MMM YYYY') ) 
    }
  })
</script>

{% endblock %}

