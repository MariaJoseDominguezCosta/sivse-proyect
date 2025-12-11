// backend/src/utils/backup.js
const cron = require('node-cron');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Asegúrate de que las variables de entorno estén cargadas
require('dotenv').config();

const { DB_HOST, DB_PORT, DB_USER, DB_NAME, DB_PASSWORD } = process.env;

// Directorio donde se guardarán los backups
const BACKUP_DIR = path.join(__dirname, '..', 'backups');
const MAX_BACKUPS = 7; // Mantener los últimos 7 backups (una semana)

// 1. Función para limpiar backups antiguos
function cleanupBackups() {
    try {
        let files = fs.readdirSync(BACKUP_DIR)
            .filter(file => file.endsWith('.sql'))
            .sort((a, b) => fs.statSync(path.join(BACKUP_DIR, b)).mtime.getTime() - fs.statSync(path.join(BACKUP_DIR, a)).mtime.getTime());

        if (files.length > MAX_BACKUPS) {
            const filesToDelete = files.slice(MAX_BACKUPS);
            filesToDelete.forEach(file => {
                fs.unlinkSync(path.join(BACKUP_DIR, file));
                console.log(`[BACKUP] Limpiado backup antiguo: ${file}`);
            });
        }
    } catch (e) {
        console.error('[BACKUP] Error durante la limpieza de backups:', e);
    }
}

// 2. Función principal de backup (usa pg_dump)
function createBackup() {
    // Asegura que el directorio exista
    if (!fs.existsSync(BACKUP_DIR)) {
        fs.mkdirSync(BACKUP_DIR, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const backupFile = path.join(BACKUP_DIR, `${DB_NAME}-${timestamp}.sql`);

    // Comando pg_dump (PostgreSQL)
    const command = `pg_dump -h ${DB_HOST} -p ${DB_PORT} -U ${DB_USER} -F p -d ${DB_NAME} -f ${backupFile}`;

    // Establecer la variable de entorno PGPASSWORD para evitar la solicitud de contraseña
    const env = { ...process.env, PGPASSWORD: DB_PASSWORD };

    exec(command, { env }, (error, stdout, stderr) => {
        if (error) {
            console.error(`[BACKUP] ERROR al crear el backup: ${error.message}`);
            // Intenta eliminar el archivo incompleto
            if (fs.existsSync(backupFile)) fs.unlinkSync(backupFile);
            return;
        }
        if (stderr) {
            console.warn(`[BACKUP] Advertencia de pg_dump: ${stderr}`);
        }
        console.log(`[BACKUP] Creado exitosamente: ${backupFile}`);
        cleanupBackups();
    });
}


// 3. Función para iniciar el programador de tareas
exports.startBackupScheduler = () => {
    // Sintaxis: '* * * * * *' (segundo, minuto, hora, díaDelMes, mes, díaDeLaSemana)
    const scheduleTime = '0 0 2 * * *'; // Cada día a las 2:00 AM
    
    console.log(`[BACKUP] Programador de backup iniciado. Horario: ${scheduleTime}`);
    
    // Iniciar el programador
    cron.schedule(scheduleTime, () => {
        console.log('[BACKUP] Ejecutando tarea programada...');
        createBackup();
    }, {
        timezone: "America/Mexico_City" // Ajusta a tu zona horaria
    });

    
};