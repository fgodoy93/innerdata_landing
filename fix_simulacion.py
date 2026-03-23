import re

html_content = """
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portafolio | Simulación SAR VMF - InnerData</title>
    <link rel="icon" type="image/x-icon" href="assets/favicon.ico">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="styles.css">
    <style>
        .portfolio-tag { font-size: 0.85rem; font-weight: 600; padding: 0.4rem 1rem; border-radius: 6px; display: inline-flex; align-items: center; gap: 0.5rem; backdrop-filter: blur(5px); }
        .tag-orange { background: rgba(200, 117, 51, 0.15); color: #f9b17a; border: 1px solid rgba(200, 117, 51, 0.4); }
        .tag-teal { background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.4); }
        .tag-blue { background: rgba(59, 130, 246, 0.15); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.4); }
        .tag-gold { background: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.4); }
        .simio-frame { background: #0d1117; padding: 1.5rem; border-radius: 8px; position: relative; overflow: hidden; border: 1px solid var(--border-color); }
        .simio-label { position: absolute; top: 1rem; left: 1rem; font-family: monospace; font-size: 0.7rem; color: rgba(247,243,236,0.7); background: rgba(0,0,0,0.8); padding: 0.25rem 0.6rem; border-radius: 4px; z-index: 2; }
        .badge { font-family: monospace; font-size: 0.65rem; padding: 0.4rem 0.8rem; border-radius: 4px; border: 1px solid; display: inline-block; }
        .badge.pass { color: #10b981; border-color: rgba(16,185,129,0.3); background: rgba(16,185,129,0.1); }
        .badge.fail { color: #ef4444; border-color: rgba(239,68,68,0.3); background: rgba(239,68,68,0.1); }
        .badge.partial { color: #f59e0b; border-color: rgba(245,158,11,0.3); background: rgba(245,158,11,0.1); }
        .process-visual { display: grid; grid-template-columns: repeat(5, 1fr); gap: 1rem; position: relative; margin-bottom: 3rem; }
        .pv-step { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 2rem 1rem; background: var(--bg-white); border-radius: 8px; box-shadow: var(--shadow-sm); position: relative; z-index: 2; border: 1px solid var(--border-color); }
        .pv-icon { width: 56px; height: 56px; border-radius: 50%; border: 1px solid var(--border-color); display: flex; align-items: center; justify-content: center; font-size: 1.4rem; margin-bottom: 1.2rem; background: #f8fafc; color: var(--primary); }
        table { width: 100%; border-collapse: collapse; font-size: 0.95rem; background: var(--bg-white); border-radius: 8px; overflow: hidden; box-shadow: var(--shadow-sm); }
        thead tr { background: var(--bg-body); color: var(--primary); }
        thead th { padding: 1rem; text-align: left; font-family: monospace; font-size: 0.75rem; }
        tbody td { padding: 1rem; border-bottom: 1px solid var(--border-color); }
    </style>
</head>
<body>
    <header class="glass-header">
        <div class="container">
            <nav>
                <a href="index.html" class="logo"><img src="assets/logo.png" style="height:40px;margin-right:10px;">Inner<span>Data</span></a>
                <ul class="nav-links"><li><a href="index.html#inicio">Inicio</a></li><li><a href="index.html#servicios">Servicios</a></li><li class="cta-nav"><a href="index.html#contacto" class="btn btn-primary">Agendar Reunión</a></li></ul>
            </nav>
        </div>
    </header>

    <section class="hero fade-in" style="min-height: 60vh; padding-top: 160px; padding-bottom: 80px; background: linear-gradient(135deg, rgba(12, 36, 68, 0.95), rgba(30, 41, 59, 0.98)), url('https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=1600&q=80') center/cover;">
        <div class="container relative text-center">
            <div class="hero-content" style="max-width: 900px; margin: 0 auto;">
                <h1 style="font-size: 3.5rem; margin-bottom: 1rem; color: white;">Optimización del flujo en el <br><span class="text-gradient-copper">SAR Víctor Manuel Fernández</span></h1>
                <p style="font-size: 1.2rem; color: #cbd5e1;">Simulación de Urgencias · Concepción, Chile</p>
            </div>
        </div>
    </section>

    <!-- Context & Proceso (Combined into 1 seamless section for scrolling) -->
    <section class="about fade-in" style="background-color: var(--bg-white); padding: 5rem 0;">
        <div class="container">
            <div class="section-header text-center">
                <span class="section-label">Problema y Proceso</span>
                <h2>Saturación Hospitalaria y Flujo del Sistema</h2>
                <p>El Hospital Guillermo Grant Benavente registraba 2.500 atenciones semanales. Para descongestionar, se abrió el SAR VMF. Con 42 funcionarios, atiende hasta 200 pacientes/día.</p>
            </div>
            
            <div class="process-visual" style="margin-top: 4rem;">
                <div class="pv-step"><div class="pv-icon">���</div><h4>Llegada</h4><p style="font-size: 0.8rem; color: var(--secondary);">Proceso Poisson no homogéneo</p></div>
                <div class="pv-step"><div class="pv-icon">���</div><h4>Admisión</h4><p style="font-size: 0.8rem; color: var(--secondary);">Unif(1.5, 2) min</p></div>
                <div class="pv-step"><div class="pv-icon">���</div><h4>Triage</h4><p style="font-size: 0.8rem; color: var(--secondary);">Unif(1, 3) min + C4/C5</p></div>
                <div class="pv-step"><div class="pv-icon">⏳</div><h4>Espera Box</h4><p style="font-size: 0.8rem; color: var(--secondary);">Cola FCFS prioridad C4</p></div>
                <div class="pv-step"><div class="pv-icon">���‍⚕️</div><h4>Atención Médica</h4><p style="font-size: 0.8rem; color: var(--secondary);">Gamma por día/cat</p></div>
            </div>
        </div>
    </section>

    <!-- SIMIO Model + Componentes -->
    <section class="services fade-in" style="background-color: var(--bg-body); padding: 5rem 0;">
        <div class="container">
            <div class="section-header">
                <span class="section-label">SIMIO 10</span>
                <h2>La maqueta digital del SAR VMF</h2>
            </div>
            
            <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 2rem;">
                <div style="display: flex; flex-direction: column; gap: 1rem;">
                    <div class="simio-frame" style="padding-bottom: 0;">
                        <img src="assets/graficos.jpeg" alt="Simio 2D" style="width: 100%; border-radius: 4px; opacity: 0.8;">
                    </div>
                </div>
                <div style="display: flex; flex-direction: column; gap: 1rem;">
                    <div class="service-card" style="padding: 1.5rem;"><h4 style="color:var(--primary);margin-bottom:0.5rem;">Source — Entradas</h4><p style="font-size:0.9rem;color:var(--secondary);">Rate Tables con tasas horarias variables (Poisson). Hasta 35 pac/hora los lunes.</p></div>
                    <div class="service-card" style="padding: 1.5rem;"><h4 style="color:var(--primary);margin-bottom:0.5rem;">Server — Triage</h4><p style="font-size:0.9rem;color:var(--secondary);">Worker TENS. Asigna C4/C5 por probabilidad.</p></div>
                    <div class="service-card" style="padding: 1.5rem;"><h4 style="color:var(--primary);margin-bottom:0.5rem;">3× Servers — Box médico</h4><p style="font-size:0.9rem;color:var(--secondary);">Consumen lista "Médicos". Distribución Gamma.</p></div>
                    <div class="service-card" style="padding: 1.5rem;"><h4 style="color:var(--primary);margin-bottom:0.5rem;">Procesos de seguimiento</h4><p style="font-size:0.9rem;color:var(--secondary);">Variables de estado en tiempo real (Tally).</p></div>
                </div>
            </div>
        </div>
    </section>

    <!-- Resultados y Escenarios -->
    <section class="about fade-in" style="padding: 5rem 0; background: var(--bg-white);">
        <div class="container">
            <div class="section-header"><h2>Resultados y Escenarios Testeados</h2></div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; margin-bottom: 4rem;">
                <div>
                     <h3 style="margin-bottom: 1rem;">Cumplimiento MINSAL Base (C4)</h3>
                     <table>
                        <thead><tr><th>Día</th><th>Espera C4</th><th>Límite C4</th><th>Estado</th></tr></thead>
                        <tbody>
                            <tr><td>LUN</td><td>68 min</td><td>180 min</td><td style="color:#10b981;font-weight:bold;">✓ Cumple</td></tr>
                            <tr><td>JUE</td><td>73 min</td><td>180 min</td><td style="color:#10b981;font-weight:bold;">✓ Cumple</td></tr>
                            <tr><td>DOM</td><td>26 min</td><td>180 min</td><td style="color:#10b981;font-weight:bold;">✓ Cumple</td></tr>
                        </tbody>
                     </table>
                     <p style="font-size:0.9rem; color:var(--secondary); margin-top:1rem;">El 95% de confianza demuestra que en condiciones normales el sistema opera con un 60-85% de holgura respecto a la normativa de 180 min.</p>
                </div>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
                    <div class="service-card" style="padding:1.5rem; text-align:center;">
                        <span class="badge pass">✓ Base</span>
                        <h4 style="margin: 0.5rem 0;">E1: Base</h4><p style="font-size:0.8rem;color:var(--secondary);">Validado con datos reales.</p>
                    </div>
                    <div class="service-card" style="padding:1.5rem; text-align:center;">
                        <span class="badge pass">✓ Estrés 30% C4</span>
                        <h4 style="margin: 0.5rem 0;">E2: + C4</h4><p style="font-size:0.8rem;color:var(--secondary);">Brotes. Cumple límite.</p>
                    </div>
                    <div class="service-card" style="padding:1.5rem; text-align:center;">
                        <span class="badge pass">✓ 100% C5</span>
                        <h4 style="margin: 0.5rem 0;">E3: Mejor Caso</h4><p style="font-size:0.8rem;color:var(--secondary);">Espera máxima 114 min.</p>
                    </div>
                    <div class="service-card" style="padding:1.5rem; text-align:center;">
                        <span class="badge partial">⚠ Falla punt.</span>
                        <h4 style="margin: 0.5rem 0;">E4: +25% Dem.</h4><p style="font-size:0.8rem;color:var(--secondary);">Resiste 6 de 7 días.</p>
                    </div>
                    <div class="service-card" style="padding:1.5rem; text-align:center;">
                        <span class="badge fail">✗ Colapso</span>
                        <h4 style="margin: 0.5rem 0;">E5: 70% C4</h4><p style="font-size:0.8rem;color:var(--secondary);">Colapso sistémico 341m.</p>
                    </div>
                    <div class="service-card" style="padding:1.5rem; text-align:center;">
                        <span class="badge pass">✓ Mejora</span>
                        <h4 style="margin: 0.5rem 0;">E6: 3 Médicos</h4><p style="font-size:0.8rem;color:var(--secondary);">Reduce tiempos en 75%.</p>
                    </div>
                </div>
            </div>
            
            <div style="background:var(--bg-body); padding: 3rem; border-radius: 8px; border-left: 4px solid var(--accent);">
                <h3 style="margin-bottom: 1.5rem;">Conclusiones Centrales</h3>
                <ul style="list-style:none; display:flex; flex-direction:column; gap:1rem;">
                    <li><strong style="color:var(--primary);">Puntos de vulnerabilidad:</strong> El domingo es la jornada crítica. Un aumento de 25% genera incumplimientos.</li>
                    <li><strong style="color:var(--primary);">Mezcla de complejidad:</strong> No es el volumen sino la proporción C4/C5 la que causa estrés. Con >70% C4 el SAR colapsa.</li>
                    <li><strong style="color:var(--primary);">Intervención propuesta:</strong> Mantener 3 médicos de forma continua en turnos solapados reduce esperas C4 dramáticamente sin ampliar infraestructura.</li>
                </ul>
            </div>
            <div style="margin-top: 3rem; text-align: center;">
                <a href="index.html" class="btn btn-outline" style="border-color: var(--primary); color: var(--primary);"><i class="fas fa-arrow-left"></i> Volver al Inicio</a>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer>
        <div class="container text-center">
            <p>&copy; 2026 InnerData. Todos los derechos reservados.</p>
        </div>
    </footer>
    <script src="script.js"></script>
</body>
</html>
"""

with open("portafolio-simulacion.html", "w", encoding="utf-8") as f:
    f.write(html_content)
