/* app.js - moved JS out of inline script for maintainability */

(function () {
  function sanitize(text) {
    const ta = document.createElement('textarea');
    ta.textContent = text;
    return ta.innerHTML;
  }

  function validateEmail(e) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  }

  function validatePhone(p) {
    return !p || /^\+?[\d\s\-\(\)]{10,}$/.test(p);
  }

  document.addEventListener('DOMContentLoaded', function () {
    // =============== Gallery Lightbox ===============
    const galleryGrid = document.getElementById('galleryGrid');
    const addPhoto = document.getElementById('add-photo');
    const shuffleBtn = document.getElementById('shuffle');

    if (galleryGrid) {
      const lightbox = document.createElement('div');
      lightbox.className = 'lightbox';
      lightbox.innerHTML =
        '<img src="" alt="Expanded image">' +
        '<button id="lbClose" aria-label="Close lightbox" style="position:absolute;top:20px;right:24px;background:none;border:none;color:#fff;font-size:28px;cursor:pointer">✕</button>';
      document.body.appendChild(lightbox);

      const lbImg = lightbox.querySelector('img');
      const lbClose = lightbox.querySelector('#lbClose');

      function openLightbox(src, alt) {
        lbImg.src = src;
        lbImg.alt = alt || 'Image';
        lightbox.classList.add('open');
      }

      function closeLightbox() {
        lightbox.classList.remove('open');
        lbImg.src = '';
      }

      galleryGrid.addEventListener('click', (e) => {
        const img = e.target.closest('img');
        if (img) openLightbox(img.src, img.alt);
      });

      lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target === lbClose) closeLightbox();
      });

      if (addPhoto) {
        addPhoto.addEventListener('click', () => {
          const seed = Math.floor(Math.random() * 10000);
          const url = `https://picsum.photos/seed/${seed}/800/600`;
          const item = document.createElement('div');
          item.className = 'gallery-item';
          item.innerHTML = `<img src="${url}" alt="Random photo">`;
          galleryGrid.prepend(item);
        });
      }

      if (shuffleBtn) {
        shuffleBtn.addEventListener('click', () => {
          const nodes = Array.from(galleryGrid.children);
          for (let i = nodes.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            galleryGrid.appendChild(nodes[j]);
            nodes.splice(j, 1);
          }
        });
      }

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
      });
    }

    // =============== Accordion ===============
    document.querySelectorAll('.accordion .accordion-item').forEach((item) => {
      const header = item.querySelector('.accordion-header');
      if (!header) return;

      header.addEventListener('click', () => {
        const wasOpen = item.classList.contains('open');
        document
          .querySelectorAll('.accordion .accordion-item.open')
          .forEach((i) => {
            i.classList.remove('open');
            const body = i.querySelector('.accordion-body');
            if (body) body.style.maxHeight = null;
          });

        if (!wasOpen) {
          item.classList.add('open');
          const body = item.querySelector('.accordion-body');
          if (body) body.style.maxHeight = body.scrollHeight + 'px';
        }
      });
    });

    // =============== Map (Leaflet) ===============
    // Only run if leaflet global exists.
    if (window.L && document.getElementById('map')) {
      const map = L.map('map', { zoomControl: true, preferCanvas: true }).setView([-23.896, 29.448], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      const markerClusterGroup = L.markerClusterGroup({
        chunkedLoading: true,
        maxClusterRadius: 50,
        iconCreateFunction: function (cluster) {
          const count = cluster.getChildCount();
          let c = 'marker-cluster ';
          if (count < 10) c += 'marker-cluster-small';
          else if (count < 30) c += 'marker-cluster-medium';
          else c += 'marker-cluster-large';

          return L.divIcon({
            html:
              '<div style="background:#c41e3a;color:white;border-radius:50%;width:40px;height:40px;display:flex;align-items:center;justify-content:center;font-weight:bold;">' +
              count +
              '</div>',
            className: c,
            iconSize: [40, 40],
          });
        },
      });

      const bakeryIcon = L.icon({
        iconUrl:
          'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjYzQxZTNhIiBkPSJNMTIgMGM2LjYyNyAwIDEyIDUuMzcyIDEyIDEycy01LjM3MyAxMi0xMiAxMlMwIDE4LjYyNyAwIDEyIDUuMzcyIDAgMTIgMHptMCA4Yy0yLjIwNSAwLTQgMS43OTUtNCA0czEuNzk1IDQgNCA0IDQtMS43OTUgNC00LTEuNzk1LTQtNC00eiIvPjwvc3ZnPg==',
        iconSize: [32, 32],
        popupAnchor: [0, -15],
      });

      const highlightIcon = L.icon({
        iconUrl:
          'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjZmJiZjI0IiBkPSJNMTIgMGM2LjYyNyAwIDEyIDUuMzcyIDEyIDEycy01LjM3MyAxMi0xMiAxMlMwIDE4LjYyNyAwIDEyIDUuMzcyIDAgMTIgMHptMCA4Yy0yLjIwNSAwLTQgMS43OTUtNCA0czEuNzk1IDQgNCA0IDQtMS43OTUgNC00LTEuNzk1LTQtNC00eiIvPjwvc3ZnPg==',
        iconSize: [32, 32],
        popupAnchor: [0, -15],
      });

      const pointIcon = L.icon({
        iconUrl:
          'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSI4IiBmaWxsPSIjMWU0MGFmIi8+PC9zdmc+',
        iconSize: [24, 24],
        popupAnchor: [0, -12],
      });

      const bakeryCoords = [-23.896, 29.448];
      const bakeryMarker = L.marker(bakeryCoords, { icon: bakeryIcon }).bindPopup(
        "<strong>🥐 Baker's Delights</strong><br>123 Bakery Street<br>📞 +27 87 557 8765<br><em>Quality artisan bakery</em>"
      );
      markerClusterGroup.addLayer(bakeryMarker);

      const featuredLocations = [
        { lat: -23.89, lng: 29.46, name: 'Fresh Bread Corner', desc: 'Sister outlet' },
        { lat: -23.91, lng: 29.43, name: 'Community Hall', desc: 'Event venue' },
        { lat: -23.88, lng: 29.47, name: 'Farmers Market', desc: 'Local market' },
      ];

      featuredLocations.forEach((loc) => {
        const m = L.marker([loc.lat, loc.lng], { icon: highlightIcon }).bindPopup(
          `<strong>${loc.name}</strong><br>${loc.desc}`
        );
        markerClusterGroup.addLayer(m);
      });

      map.addLayer(markerClusterGroup);

      L.circle(bakeryCoords, {
        radius: 3000,
        color: '#1e40af',
        fillColor: '#3b82f6',
        fillOpacity: 0.1,
        weight: 2,
        dashArray: '5,5',
      })
        .bindPopup('Delivery Zone (3km radius)')
        .addTo(map);

      const addMarkerBtn = document.getElementById('addMarker');
      const locateBtn = document.getElementById('locateBtn');
      const clearMarkersBtn = document.getElementById('clearMarkers');
      const mapToggle = document.getElementById('mapToggle');
      const googleMapDiv = document.getElementById('googleMap');
      const leafletMapDiv = document.getElementById('map');

      if (addMarkerBtn) {
        addMarkerBtn.addEventListener('click', () => {
          const lat = bakeryCoords[0] + (Math.random() - 0.5) / 150;
          const lng = bakeryCoords[1] + (Math.random() - 0.5) / 150;
          const m = L.marker([lat, lng], { icon: pointIcon }).bindPopup(
            'New marker added at ' + new Date().toLocaleTimeString()
          );
          markerClusterGroup.addLayer(m);
          map.panTo([lat, lng], { animate: true, duration: 0.9 });
        });
      }

      if (locateBtn) {
        locateBtn.addEventListener('click', () => {
          map.setView(bakeryCoords, 15, { animate: true, duration: 0.9 });
          bakeryMarker.openPopup();
        });
      }

      if (clearMarkersBtn) {
        clearMarkersBtn.addEventListener('click', () => {
          markerClusterGroup.clearLayers();
          markerClusterGroup.addLayer(bakeryMarker);
          featuredLocations.forEach((loc) => {
            const m = L.marker([loc.lat, loc.lng], { icon: highlightIcon }).bindPopup(
              `<strong>${loc.name}</strong><br>${loc.desc}`
            );
            markerClusterGroup.addLayer(m);
          });
          map.invalidateSize();
        });
      }

      window.addEventListener('resize', () => map.invalidateSize());

      // =============== Google Maps Toggle ===============
      let googleMapInstance = null;
      let googleMapMarker = null;
      let useGoogleMap = false;

      function initGoogleMap() {
        if (googleMapInstance) return;
        if (!window.google || !googleMapDiv) return;

        const bakeryLocation = { lat: -23.896, lng: 29.448 };
        googleMapInstance = new google.maps.Map(googleMapDiv, {
          zoom: 13,
          center: bakeryLocation,
          mapTypeControl: true,
          zoomControl: true,
          fullscreenControl: true,
          streetViewControl: true,
          styles: [
            { featureType: 'all', elementType: 'geometry', stylers: [{ color: '#f5f5f5' }] },
            { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#c9c9c9' }] },
            { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
          ],
        });

        googleMapMarker = new google.maps.Marker({
          position: bakeryLocation,
          map: googleMapInstance,
          title: "Baker's Delights",
          icon: 'https://maps.google.com/mapfiles/ms/mpl/red-dot.png',
        });

        const infoWindow = new google.maps.InfoWindow({
          content:
            '<div style="padding:10px;font-weight:bold">Baker\'s Delights<br>123 Bakery Street, Polokwane<br>📞 +27 87 557 8765</div>',
        });

        googleMapMarker.addListener('click', () => {
          infoWindow.open(googleMapInstance, googleMapMarker);
        });

        infoWindow.open(googleMapInstance, googleMapMarker);
      }

      if (mapToggle) {
        mapToggle.addEventListener('click', () => {
          useGoogleMap = !useGoogleMap;
          if (!leafletMapDiv || !googleMapDiv) return;

          if (useGoogleMap) {
            leafletMapDiv.style.display = 'none';
            googleMapDiv.style.display = 'block';
            mapToggle.textContent = 'Switch to Leaflet Map';
            if (!googleMapInstance) initGoogleMap();
            const addMarker = document.getElementById('addMarker');
            if (addMarker) addMarker.style.display = 'none';
          } else {
            leafletMapDiv.style.display = 'block';
            googleMapDiv.style.display = 'none';
            mapToggle.textContent = 'Switch to Google Maps';
            const addMarker = document.getElementById('addMarker');
            if (addMarker) addMarker.style.display = 'inline-block';
          }
          map.invalidateSize();
        });
      }
    }

    // =============== Products ===============
    const productsList = document.getElementById('productsList');
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const sortSelect = document.getElementById('sortSelect');
    const loadMoreBtn = document.getElementById('loadMore');
    const resetBtn = document.getElementById('resetFilters');

    if (productsList && searchInput && categoryFilter && sortSelect && loadMoreBtn) {
      let items = [];
      let renderedCount = 0;

      function renderItems(reset = false) {
        const q = (searchInput.value || '').trim().toLowerCase();
        const cat = categoryFilter.value;
        const sort = sortSelect.value;

        let list = items.slice();
        if (cat) list = list.filter((i) => i.category === cat);
        if (q) list = list.filter((i) => (i.title + ' ' + i.description).toLowerCase().includes(q));

        if (sort === 'name-asc') list.sort((a, b) => a.title.localeCompare(b.title));
        if (sort === 'name-desc') list.sort((a, b) => b.title.localeCompare(a.title));
        if (sort === 'price-asc') list.sort((a, b) => a.price - b.price);
        if (sort === 'price-desc') list.sort((a, b) => b.price - a.price);

        if (reset) {
          productsList.innerHTML = '';
          renderedCount = 0;
        }

        const toRender = list.slice(renderedCount, renderedCount + 4);
        toRender.forEach((p) => {
          const card = document.createElement('article');
          card.className = 'product-card';
          card.innerHTML =
            `<img src="${sanitize(p.image)}" alt="${sanitize(p.title)}">` +
            `<div class="product-body">` +
            `<h4>${sanitize(p.title)}</h4>` +
            `<p>${sanitize(p.description)}</p>` +
            `<div class="product-meta">` +
            `<span class="price-badge">R${p.price}</span>` +
            `<small>${sanitize(p.category)}</small>` +
            `</div>` +
            `</div>`;
          productsList.appendChild(card);
        });

        renderedCount += toRender.length;
        loadMoreBtn.style.display = renderedCount < list.length ? 'inline-block' : 'none';

        if (list.length === 0) {
          productsList.innerHTML =
            '<p style="grid-column:1/-1;text-align:center;color:#666">No products found.</p>';
          loadMoreBtn.style.display = 'none';
        }
      }

      fetch('data/items.json')
        .then((r) => r.json())
        .then((data) => {
          items = data;
          const cats = Array.from(new Set(items.map((i) => i.category)));
          categoryFilter.innerHTML =
            '<option value="">All categories</option>' +
            cats.map((c) => `<option value="${c}">${c}</option>`).join('');
          renderItems(true);
        })
        .catch(() => {
          productsList.innerHTML =
            '<p style="grid-column:1/-1;text-align:center;color:#900">Failed to load products.</p>';
        });

      let searchTimer = null;
      searchInput.addEventListener('input', () => {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(() => renderItems(true), 250);
      });
      categoryFilter.addEventListener('change', () => renderItems(true));
      sortSelect.addEventListener('change', () => renderItems(true));

      loadMoreBtn.addEventListener('click', () => renderItems(false));

      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          searchInput.value = '';
          categoryFilter.value = '';
          sortSelect.value = 'name-asc';
          renderItems(true);
        });
      }
    }

    // =============== Contact Form ===============
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
      contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const fname = document.getElementById('fname').value.trim();
        const femail = document.getElementById('femail').value.trim();
        const fphone = document.getElementById('fphone').value.trim();
        const fmessage = document.getElementById('fmessage').value.trim();
        const fconsent = document.getElementById('fconsent').checked;

        const formMsg = document.getElementById('formMessage');
        const submitBtn = document.getElementById('submitBtn');

        let isValid = true;

        document.getElementById('fnameError').style.display = 'none';
        document.getElementById('femailError').style.display = 'none';
        document.getElementById('fmessageError').style.display = 'none';
        document.getElementById('fconsentError').style.display = 'none';

        if (fname.length < 2) {
          isValid = false;
          document.getElementById('fnameError').textContent = 'Name must be at least 2 characters';
          document.getElementById('fnameError').style.display = 'block';
        } else if (!validateEmail(femail)) {
          isValid = false;
          document.getElementById('femailError').textContent = 'Please enter a valid email';
          document.getElementById('femailError').style.display = 'block';
        } else if (!validatePhone(fphone)) {
          isValid = false;
          alert('Invalid phone format');
        } else if (fmessage.length < 10) {
          isValid = false;
          document.getElementById('fmessageError').textContent = 'Message must be at least 10 characters';
          document.getElementById('fmessageError').style.display = 'block';
        } else if (!fconsent) {
          isValid = false;
          document.getElementById('fconsentError').textContent = 'You must agree to continue';
          document.getElementById('fconsentError').style.display = 'block';
        }

        if (isValid) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Sending...';

          const safeData = {
            name: sanitize(fname),
            email: sanitize(femail),
            phone: sanitize(fphone),
            message: sanitize(fmessage),
          };

          console.log('Form submitted (sanitized)', safeData);

          setTimeout(() => {
            formMsg.style.color = '#0a0';
            formMsg.textContent = "✓ Message received! We'll contact you soon.";
            contactForm.reset();
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';
            setTimeout(() => {
              formMsg.textContent = '';
            }, 5000);
          }, 1000);
        }
      });
    }
  });
})();

