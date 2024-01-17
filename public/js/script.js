$(document).ready(()=>{
    $.ajax({
    url: '/json',  //llama a la funcion del servidor
    type: 'GET',
    dataType: 'json',
    success: function(data) {//si la peticion se ejecuta con exito se ejecuta la funcion
        const contenedorProductos = $('#productos');
        $.each(data, function(index, producto) {
            const productoDiv = $('<div>').addClass('col-md-4 mb-4');
            productoDiv.html(`
                <div class="card">
                    <img src="${producto['﻿imagen-src']}" alt="${producto.titulo}" class="card-img-top">
                    <div class="card-body bg-primary text-light">
                        <h5 class="card-title">${producto.titulo}</h5>
                        <p class="card-text">Precio: ${producto.precio}</p>
                    </div>
                </div>
            `);
            contenedorProductos.append(productoDiv);
        });
    },
    error: function(error) {//si la peticion no se puede realizar salta el error
        console.error('Error al obtener los productos:', error);
    }
    });
    //RSS
    function llamarRSS() {
    $.ajax({
        url: '/rssMarca',
        method: 'GET',
        success: function(data) {
            renderizarDatos(data);
        },
        error: function() {
            alert('Error al obtener el feed RSS');
        }
    });
    }

    // Función para renderizar el feed RSS
    function renderizarDatos(data) {
    const rssFeedElement = $("#rssFeed");

    // Mostrar información del canal
    const channelInfo = `
        <h1>${data.rss.channel.title}</h1>
        <p>${data.rss.channel.description}</p>
        <img src="${data.rss.channel.image.url}" alt="${data.rss.channel.image.description}" class="mx-auto d-block items-aling-center">`;
    rssFeedElement.html(channelInfo);

    // Mostrar cada elemento en el feed
    if (data.rss.channel.item && Array.isArray(data.rss.channel.item)) {
        data.rss.channel.item.forEach(item => {
            // Verificar si 'media:content' y 'media:content.$.url' están presentes
            const imgUrl = item["media:content"] && item["media:content"].$ && item["media:content"].$.url;

            // Mostrar información del elemento
            const itemInfo = `
                <div class="card mb-3">
                    <div class="card-body">
                        <h2 class="card-title">${item.title}</h2>
                        <p class="card-text">${item.description}</p>
                        <img src="${imgUrl || ''}" class="card-img-top foto-marca" alt="${item["media:title"]._}">
                        <p class="card-text">${item["media:description"]._}</p>
                        <p class="card-text"><small class="text-muted">Publicado en: ${item.pubDate}</small></p>
                        <a href="${item.link}" class="btn btn-primary" target="_blank">Leer más</a>
                    </div>
                </div>`;

            rssFeedElement.append(itemInfo);
        });
    }
    }
    llamarRSS();

    $('#boton').on('click',redirigirRSS)// Llama a la función de renderizado con los datos JSON proporcionados

    function redirigirRSS() {
    window.location.href = '/rss.html';
    }
    // Atom
    function llamarAtom() {
    $.ajax({
        url: '/atom',
        method: 'GET',
        success: function(data) {
            renderizarDatosAtom(data);
        },
        error: function() {
            alert('Error al obtener el feed Atom');
        }
    });
    }
    function renderizarDatosAtom(data) {
        const atomFeedElement = $("#atomFeed");
    
        // Mostrar información del feed Atom
        const feedInfo = `
            <h1>${data.feed.title._}</h1>
            <p>Última actualización: ${data.feed.updated}</p>`;
        atomFeedElement.html(feedInfo);
        console.log(data);
        // Mostrar cada entrada en el feed Atom
        if (data.feed.entry && Array.isArray(data.feed.entry)) {
            data.feed.entry.forEach(entry => {
                // Mostrar información de la entrada
                const entryInfo = `
                    <div class="card mb-3">
                        <div class="card-body">
                            <h2 class="card-title">${entry.title._ || entry.title}</h2>
                            <p class="card-text">${entry.summary._ || entry.summary}</p>
                            <img src="${obtenerURLImagen(entry)}" class="card-img-top foto" alt="${entry.title._ || entry.title}">
                            <p class="card-text"><small class="text-muted">Publicado en: ${entry.published}</small></p>
                            <a href="${getEntryLink(entry)}" class="btn btn-primary" target="_blank">Leer más</a>
                        </div>
                    </div>`;
    
                atomFeedElement.append(entryInfo);
            });
        }
    }
        // Función auxiliar para obtener la URL de la miniatura
        function obtenerURLImagen(entry) {
            if (entry.link && entry.link["media:content"] && entry.link["media:content"]["media:thumbnail"] && Array.isArray(entry.link["media:content"]["media:thumbnail"])) {
                return entry.link["media:content"]["media:thumbnail"][0].img.$.src;
            } else {
                return '';
            }
        }
        // Función auxiliar para obtener la URL de la entrada
        function getEntryLink(entry) {
            if (entry.link && entry.link["@href"]) {
                return entry.link["@href"];
            } else {
                return '#';
            }
        }
        llamarAtom();
        $('#boton2').on('click',redirigirAtom);
        function redirigirAtom() {
            window.location.href = '/atom.html';
        }
        
});