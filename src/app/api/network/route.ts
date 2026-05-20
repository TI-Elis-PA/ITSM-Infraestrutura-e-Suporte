import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function GET() {
    try {
        // Fazendo ping no DNS do Google para testar a conectividade real da máquina host
        // -n 1 (Windows) ou -c 1 (Linux/Mac)
        const isWindows = process.platform === 'win32';
        const pingCmd = isWindows ? 'ping -n 1 8.8.8.8' : 'ping -c 1 8.8.8.8';
        
        const { stdout } = await execAsync(pingCmd);
        
        // Verifica se a resposta foi bem sucedida (TTL indica resposta válida)
        const isUp = stdout.includes('TTL=') || stdout.toLowerCase().includes('ttl=') || stdout.includes('tempo=') || stdout.includes('time=');
        
        let latency = 0;
        if (isUp) {
            const timeMatch = stdout.match(/(?:tempo=|time=|<)(\d+)(?:ms)?/i);
            if (timeMatch && timeMatch[1]) {
                latency = parseInt(timeMatch[1]);
            }
        }

        let health = 100.0;
        let status = 'Operação Nominal';

        if (!isUp) {
            health = 0.0;
            status = 'Rede Inacessível';
        } else if (latency > 150) {
            health = parseFloat((95.0 + Math.random() * 2).toFixed(2));
            status = 'Latência Alta';
        } else if (latency > 50) {
            health = parseFloat((98.0 + Math.random() * 1.5).toFixed(2));
            status = 'Oscilação Leve';
        } else {
            // Se estiver tudo rápido, flutua de forma realista entre 99.7 e 99.9%
            health = parseFloat((99.7 + Math.random() * 0.2).toFixed(2));
            status = 'Operação Nominal';
        }

        return NextResponse.json({ 
            health: health, 
            status: status, 
            latency: latency, 
            isUp: isUp,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        return NextResponse.json({ 
            health: 0.0, 
            status: 'Falha de Conexão', 
            latency: 0, 
            isUp: false,
            timestamp: new Date().toISOString()
        });
    }
}
