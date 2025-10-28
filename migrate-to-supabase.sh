#!/bin/bash

# Script de migración a Supabase para QuizPro
# Este script actualiza automáticamente los imports para usar Supabase

echo "🚀 Iniciando migración a Supabase..."
echo ""

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Backup de archivos
echo "📦 Creando backup de archivos..."
cp src/components/admin/AdminDashboard.jsx src/components/admin/AdminDashboard.jsx.backup
cp src/components/admin/QuizEditor.jsx src/components/admin/QuizEditor.jsx.backup

echo "${GREEN}✅ Backup creado${NC}"
echo ""

# Actualizar AdminDashboard.jsx
echo "🔧 Actualizando AdminDashboard.jsx..."
sed -i.bak "s/import { storageService } from '..\/..\/services\/storageService';/import { hybridStorageService as storageService } from '..\/..\/services\/hybridStorageService';/" src/components/admin/AdminDashboard.jsx

# Agregar inicialización en AdminDashboard
# (esto es más complejo, se hace manualmente)

echo "${GREEN}✅ AdminDashboard.jsx actualizado${NC}"
echo ""

# Actualizar QuizEditor.jsx
echo "🔧 Actualizando QuizEditor.jsx..."
sed -i.bak "s/import { storageService } from '..\/..\/services\/storageService';/import { hybridStorageService as storageService } from '..\/..\/services\/hybridStorageService';/" src/components/admin/QuizEditor.jsx

echo "${GREEN}✅ QuizEditor.jsx actualizado${NC}"
echo ""

# Limpiar archivos temporales de sed
rm -f src/components/admin/*.bak

echo "✨ Migración completada!"
echo ""
echo "${YELLOW}IMPORTANTE:${NC}"
echo "1. Ejecuta el SQL en Supabase Dashboard (ver supabase-schema.sql)"
echo "2. Verifica el archivo .env con tus credenciales"
echo "3. Reinicia el servidor: npm run dev"
echo ""
echo "Archivos de backup guardados con extensión .backup"
echo ""
echo "📖 Lee INSTRUCCIONES-COMPLETAS.md para más detalles"
