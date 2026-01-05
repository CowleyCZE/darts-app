# 🎯 Darts Tracker

Jednoduchá a intuitivní aplikace pro sledování skóre v šipkách, která umožňuje hráčům spravovat statistiky a historii zápasů přímo na zařízení. Tato aplikace je vytvořena pomocí React.js, Tailwind CSS a Capacitor.js, což umožňuje její spuštění jako progresivní webovou aplikaci (PWA) nebo jako nativní Android aplikaci.

## ✨ Funkce

- **Správa hráčů:** Snadné přidávání, přejmenování a mazání hráčů.
- **Nastavení zápasu:** Konfigurace typu hry (301, 501 atd.), počtu setů a legů na set, s volitelnými pravidly Double In / Double Out.
- **Interaktivní výsledková tabule:** Přehledné zobrazení skóre a aktuálního hráče.
- **Historie zápasů:** Uchovává záznamy o odehraných zápasech.
- **Síň slávy:** Zobrazuje statistiky hráčů, včetně počtu výher a celkových zápasů.
- **Lokální ukládání dat:** Všechna data jsou ukládána přímo ve vašem zařízení, bez nutnosti připojení k internetu nebo externích služeb (jako je Firebase).

## 🚀 Technologie

- **Frontend:** [React.js](https://reactjs.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Mobile app runtime:** [Capacitor.js](https://capacitorjs.com/)
- **Build tool:** [Vite](https://vitejs.dev/)
- **Lokální úložiště:** [LocalForage](https://localforage.github.io/localForage/)

## 🛠️ Lokální vývoj

Chcete-li spustit aplikaci lokálně pro vývoj nebo testování:

1.  **Klonujte repozitář:**
    ```bash
    git clone https://github.com/VÁŠ_GITHUB_USER/sipky-app.git
    cd sipky-app
    ```
2.  **Nainstalujte závislosti:**
    ```bash
    npm install
    ```
3.  **Spusťte vývojový server:**
    ```bash
    npm run dev
    ```
    Aplikace bude k dispozici na `http://localhost:5173` (nebo jiném portu).

## 📱 Sestavení pro Android

Tento projekt je nakonfigurován pro automatické sestavování Android APK souborů pomocí **GitHub Actions**.

1.  **Nahrajte změny na GitHub** (do větve `main` nebo `master`).
2.  Navštivte záložku **Actions** ve vašem GitHub repozitáři.
3.  Najděte workflow s názvem "Build Android APK". Po úspěšném dokončení workflow si stáhněte vygenerovaný `sipky-app-debug.zip` soubor, který obsahuje APK.

Alternativně můžete sestavit lokálně (vyžaduje Android Studio a SDK):

```bash
npm run build
npx cap sync
npx cap add android # Pokud jste ještě nepřidali platformu
npx cap open android # Otevře Android Studio pro sestavení
```