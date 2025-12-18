# 📚 Guía de Estilos - Mendizabala LHII

Una guía completa de estilos moderna, limpia e intuitiva para el sistema de gestión de Mendizabala LHII.

## 🎨 Paleta de Colores

### Colores Principales
- **Azul Profesional** (#1e5a96): Color principal para acciones y navegación
- **Verde Vibrante** (#2e7d32): Color de acento para destacar acciones importantes
- **Grises Neutrales**: Escala completa para fondos, bordes y estados

### Colores de Estado
- **Verde** ✓ (Quiere): Estados positivos
- **Naranja** ⚠ (En espera): Estados de advertencia
- **Rojo** ✕ (No quiere): Estados negativos o problemas

## 🔤 Tipografía

### Fuentes
- **Sistema de fuentes**: System UI, Roboto, Segoe UI (optimizado para cada dispositivo)
- **Monoespaciado**: Courier New para código

### Tamaños de Fuente
- **Títulos principales**: 32px (h1)
- **Títulos secundarios**: 24px (h2)
- **Subtítulos**: 20px (h3)
- **Texto base**: 16px
- **Pequeño**: 14px
- **Mini**: 12px

### Pesos
- Regular (400)
- Medium (500)
- Semibold (600) - para énfasis
- Bold (700) - para títulos

## 📏 Espaciado

Sistema de espaciado consistente:
- XS: 4px
- SM: 8px
- MD: 12px
- LG: 16px
- XL: 24px
- 2XL: 32px
- 3XL: 48px

**Regla**: Usa siempre espaciado del sistema, no valores arbitrarios.

## 🎯 Componentes

### Botones

#### Variantes principales
```
[Primario] - Acciones principales (azul)
[Secundario] - Acciones alternas (contorno)
[Ghost] - Enlaces sin estilo
[Peligro] - Acciones destructivas (rojo)
```

#### Tamaños
- Small: Para acciones secundarias en tablas
- Base: Para formularios y barras de herramientas
- Large: Para CTAs principales

#### Estados
- `:hover` - Cambio de color y sombra
- `:active` - Presionado
- `:disabled` - Deshabilitado (opacidad 50%)

### Tarjetas

Las tarjetas son contenedores principales para información:
- Borde sutil (1px)
- Esquinas redondeadas (8px)
- Sombra en hover
- Padding consistente (16px)

### Formularios

#### Estructura
- Etiqueta clara y visible
- Campo de entrada con borde sutil
- Mensaje de ayuda (gris, pequeño)
- Mensaje de error (rojo)
- Espaciado vertical consistente

#### Focus States
- Borde azul (#1e5a96)
- Sombra azul suave
- Sin outline (handled por sombra)

### Tablas

- Header con fondo gris claro
- Filas alternadas (hover)
- Bordes sutiles entre celdas
- Datos alineados a la izquierda
- Números alineados a la derecha

### Modales

- Fondo semi-transparente (40% negro)
- Contenedor blanco con sombra
- Ancho máximo: 520px
- Header con título y botón cerrar
- Body scrolleable
- Footer con acciones

## 🎬 Transiciones

- **Rápidas** (150ms): Hover effects
- **Base** (250ms): Cambios de estado principales
- **Lentas** (350ms): Animaciones importantes (modales, dropdowns)

## 📱 Responsive

### Breakpoints
- **Desktop**: 1400px (contenedor máximo)
- **Tablet**: 1024px (sidebar colapsable)
- **Mobile**: 768px (layout de columna única)
- **Small**: 480px (ajustes finales)

### Estrategia
1. Mobile-first en HTML
2. Mejoras progresivas con media queries
3. Flexibilidad en grillas (auto-fit, minmax)

## ♿ Accesibilidad

- Contraste suficiente (WCAG AA)
- Etiquetas asociadas a inputs
- Atributos aria-* donde sea necesario
- Focus visible en todos los elementos interactivos
- Alt text en imágenes
- Estructura semántica HTML

## 🚀 Uso en React

### CSS Variables
```css
var(--primary)          /* Azul principal */
var(--accent)           /* Verde acento */
var(--text-primary)     /* Texto principal */
var(--spacing-lg)       /* Espaciado */
var(--border-radius-md) /* Bordes redondeados */
```

### Clases Reutilizables
```jsx
<div className="card">
  <h2 className="card-title">Título</h2>
  <p>Contenido</p>
</div>

<button className="primary">Acción principal</button>
<button className="secondary">Acción secundaria</button>

<div className="empty-state">
  <div style={{ fontSize: '48px' }}>🎯</div>
  <h3>Sin datos</h3>
  <p>Añade datos para comenzar</p>
</div>
```

## 🎨 Tema Oscuro (Futuro)

Aunque actualmente el sistema es light-mode, está diseñado para soportar dark mode en el futuro:
- CSS variables permiten cambio dinámico
- Suficiente contraste en ambos modos
- Estructura preparada para múltiples temas

## 📋 Checklist de Diseño

Al crear nuevos componentes, asegúrate de:
- [ ] Usar variables CSS del design system
- [ ] Mantener espaciado consistente
- [ ] Incluir estados hover/focus
- [ ] Probar en mobile
- [ ] Validar contraste de colores
- [ ] Usar iconos consistentes (emoji o iconografía)
- [ ] Añadir transiciones suaves
- [ ] Escribir copy claro y conciso
- [ ] Documentar interacciones complejas

## 🔧 Mantenimiento

### Actualizar Variables
1. Edita `src/design-system.css` `:root`
2. Los cambios se aplican globalmente
3. No necesita recompilación (CSS variables en tiempo de ejecución)

### Añadir Nuevos Componentes
1. Usa clases base del design system
2. Evita estilos inline excepto para lógica dinámica
3. Documenta en este archivo
4. Prueba en ambos idiomas (ES/EU)

## 📞 Soporte

Para profesores sin experiencia técnica:
- Los botones tienen colores e iconos claros
- Las acciones importantes están destacadas
- Los errores se muestran con mensajes claros
- Las transiciones son suaves y predecibles
- El diseño mobile es completo

---

**Versión**: 1.0.0  
**Actualizado**: Diciembre 2025  
**Inspirado en**: https://www.mendizabala.eus/
