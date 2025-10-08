# Migración a Date Pickers Compatibles con Dispositivos Móviles

## Problema Identificado
Los componentes actuales de selección de fechas basados en Radix UI (a través de Shadcn) no funcionan correctamente en dispositivos móviles. Específicamente, los popovers no se abren cuando se interactúa con ellos en dispositivos móviles, lo que impide la selección de fechas.

## Solución Propuesta
Implementar componentes de selección de fechas alternativos utilizando la biblioteca `react-datepicker` que tiene mejor soporte para dispositivos móviles. Esta biblioteca utiliza un enfoque de "portal" que asegura que el selector de fechas siempre sea visible y utilizable en dispositivos móviles.

## Componentes Creados

### 1. Componentes Base:
- `MobileDatePicker` - Para selección de fechas individuales
- `MobileDateRangePicker` - Para selección de rangos de fechas

### 2. Componentes de Formulario Adaptados:
- `MobileFormItems` - Versión compatible con móviles de `FormItems`
- `MobileFormPaymentSchedule` - Versión compatible con móviles de `FormPaymentSchedule`

## Estrategia de Implementación

### Paso 1: Detección de Dispositivo Móvil
Implementar una utilidad para detectar si el usuario está en un dispositivo móvil:

```typescript
// hooks/useIsMobile.ts
import { useState, useEffect } from 'react';

export default function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    // Función para comprobar si es móvil
    const checkIfMobile = () => {
      const userAgent = 
        typeof window.navigator === 'undefined' ? '' : navigator.userAgent;
      const mobile = Boolean(
        userAgent.match(
          /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
        )
      );
      setIsMobile(mobile);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);
  
  return isMobile;
}
```

### Paso 2: Componentes Adaptativos

Crear versiones adaptativas de los componentes que utilizan selectores de fechas:

```tsx
// components/ui/adaptive-date-picker.tsx
"use client";

import { DatePicker } from "@/components/ui/date-picker";
import { MobileDatePicker } from "@/components/ui/react-datepicker";
import useIsMobile from "@/hooks/useIsMobile";

interface AdaptiveDatePickerProps {
  date: Date | null;
  onDateChange: (date: Date | null) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function AdaptiveDatePicker(props: AdaptiveDatePickerProps) {
  const isMobile = useIsMobile();
  
  if (isMobile) {
    return <MobileDatePicker {...props} />;
  }
  
  return <DatePicker {...props} />;
}
```

```tsx
// components/ui/adaptive-date-range-picker.tsx
"use client";

import { DateRangePicker } from "@/components/ui/date-range-picker";
import { MobileDateRangePicker } from "@/components/ui/react-datepicker";
import useIsMobile from "@/hooks/useIsMobile";

interface AdaptiveDateRangePickerProps {
  dateRange: {
    from: Date | null;
    to: Date | null;
  };
  onDateRangeChange: (range: { from: Date | null; to: Date | null }) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function AdaptiveDateRangePicker(props: AdaptiveDateRangePickerProps) {
  const isMobile = useIsMobile();
  
  if (isMobile) {
    return <MobileDateRangePicker {...props} />;
  }
  
  // Adaptar el formato para el DateRangePicker original
  const adaptedProps = {
    date: props.dateRange,
    onDateChange: props.onDateRangeChange,
    placeholder: props.placeholder,
    className: props.className,
    disabled: props.disabled
  };
  
  return <DateRangePicker {...adaptedProps} />;
}
```

### Paso 3: Sustituir los Componentes en los Formularios Existentes

Modificar todos los formularios que utilizan selectores de fechas para usar los componentes adaptativos:

1. Reemplazar las importaciones:
```tsx
// Antes
import { DatePicker } from "@/components/ui/date-picker";
// Después
import { AdaptiveDatePicker } from "@/components/ui/adaptive-date-picker";
```

2. Reemplazar los componentes:
```tsx
// Antes
<DatePicker date={field.value} onDateChange={field.onChange} />
// Después
<AdaptiveDatePicker date={field.value} onDateChange={field.onChange} />
```

## Ventajas de Esta Solución

1. **Experiencia Mejorada en Móviles**: Los selectores de fechas funcionarán en todos los dispositivos.
2. **Transición Suave**: Los componentes adaptativos permiten usar la versión de escritorio en dispositivos grandes.
3. **Consistencia Visual**: Se mantiene la apariencia similar a los componentes actuales.
4. **Flexibilidad**: Fácil de extender o personalizar si se necesitan más funcionalidades.

## Próximos Pasos Sugeridos

1. Implementar la detección de dispositivos móviles.
2. Crear los componentes adaptativos.
3. Actualizar los formularios existentes uno por uno para usar los nuevos componentes.
4. Probar en diferentes dispositivos para garantizar la compatibilidad.
5. Considerar añadir personalización adicional al estilo de `react-datepicker` para que coincida mejor con el diseño actual.