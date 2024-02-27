$(document).ready(function () {
  //funcion que valida el numero del heroe
  function validar(num) {
    let pasamosLaValidacion = true; // inicializa el interruptor para validacion true o false
    let validacionNumero = /^[0-9]+$/; // patron para solo aceptar numeros positivos
    if (validacionNumero.test(num) === false) {
      pasamosLaValidacion = false;
      limpiar();
      alert("Ingrese un numero entre 1 y 731");
    }
    return pasamosLaValidacion;
  }
  //funcion para limppiar las secciones donde mostramos informacion del heroe encontrado
  function limpiar() {
    $("#mostrar_heroe").hide();
    $(".resultado").html("");
    $(".img_heroe").html("");
    $("#chartContainer").html("");
  }

  $("#btn_heroe").on("click", function () {
    let num_heroe = $("#heroe").val(); //recibimos el numero del heroe a buscar
    let validacion = validar(num_heroe); //validamos que sea numero
    if (validacion == true) {
      limpiar();
      $.ajax({
        type: "GET",
        url:
          "https://www.superheroapi.com/api.php/4905856019427443/" + num_heroe,
        dataType: "json",
        success: function (response) {
          console.log(response);
          console.log(response.error);
          if (response.error == "invalid id") {
            alert(
              "Número de SuperHero no encontrado : " +
                response.error +
                "\nIngrese un numero entre 1 y 731"
            );
          } else {
            //desplegamos la imagen del superhero
            $(".img_heroe")
              .append(`<img src="${response.image.url}" class="img-fluid rounded-start" alt="${response.name}"></img>
      `);
            //desplegamos los datos del superhero
            $(".resultado").append(`
        <h5 class="card-title">Nombre: ${response.name}</h5>
        <p class="card-text">Conexiones: ${response.connections["group-affiliation"]}</p>
        <p class="card-text "><small><em>Publicado por:</em> ${response.biography.publisher}</small></p>
        <p class="card-text border-top"><small><em>Ocupación:</em> ${response.work.occupation}</small></p>
        <p class="card-text border-top"><small><em>Primera Aparición:</em> ${response.biography["first-appearance"]}</small></p>
        <p class="card-text border-top"><small><em>Altura:</em> ${response.appearance.height}</small></p>
        <p class="card-text border-top"><small><em>Peso:</em> ${response.appearance.weight}</small></p>
        <p class="card-text border-top"><small><em>Alianzas:</em> ${response.biography.aliases}</small></p>
        `);
            //desplegamos el grafico del superhero
            let dataPoints = []; //inicializamos el arreglo con coordenadas para el grafico
            let grafico_torta = {
              title: { text: "Estadísticas de Poder para " + response.name },
              data: [
                {
                  type: "pie",
                  indexLabel: "{name} ({y})",
                  showInLegend: true,
                  dataPoints: dataPoints,
                },
              ],
            };

            // comprobamos que no sean nulo los valores de x axis - y axis del grafico
            for (const key in response.powerstats) {
              if (response.powerstats[key] != "null") {
                dataPoints.push({
                  name: key, // esta seria la propiedad
                  y: Number(response.powerstats[key]), // esta seria el value
                });
              }
            }
            //mostramos informacion de heroe
            $("#mostrar_heroe").show(); //datos
            $("#chartContainer").CanvasJSChart(grafico_torta); //grafico
          } //new
        },
        error: function (error) {
          console.log(error);
          console.log("error", error.status);
        },
      });
    } //new
  });
});
