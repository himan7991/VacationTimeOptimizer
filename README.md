# VacationTimeOptimizer

Vacation Time Optimizer is a web application that helps you decide when to use your paid time off (PTO) so that
every day you book connects to as many weekends and public holidays as possible.

You can find it at [VacationTimeOptimizer](https://himan7991.github.io/VacationTimeOptimizer)

## Screenshots

![Screenshot 2024-01-12 at 17-30-52 Vacation Time Optimizer](https://github.com/himan7991/VacationTimeOptimizer/assets/20800493/9185e0fd-77f7-472d-8d3e-d9da7356431b)

|                                                    Tablet                                                    |                                                    Mobile                                                    |
| :----------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------: |
| ![](https://github.com/himan7991/VacationTimeOptimizer/assets/20800493/6d853c14-2ed7-49b4-b863-dafe17936766) | ![](https://github.com/himan7991/VacationTimeOptimizer/assets/20800493/ce2b7971-3c97-4bef-9f9b-49a8a09dd029) |

## Features

- **Public holidays for over 100 countries**, from the [Nager.Date](https://date.nager.at/) API.
- **Two planning modes.** _Best overall_ spreads your PTO days across the year. _Consecutive_ finds
  the single longest break you can get with the days you have.
- **Enter the PTO days you have.** The summary shows how many days off you get in return, and a tip
  tells you when one more PTO day would unlock a noticeably longer break.
- **Pin must-take days.** Click any working day in the calendar to force it into the plan. Both
  modes build the rest of the plan around your pins.
- **Shift the planning year.** The 12-month window starts in January by default and be shifted up
  to a year either way, so an April-to-March leave year works just as well.
- Light and dark themes, keyboard-accessible calendar, and a hover or tap tooltip with each
  holiday's local and English name.

## Usage

1. Confirm the detected country, or pick yours with the globe icon.
2. Enter how many PTO days you have.
3. Choose _Best overall_ or _Consecutive_.
4. Optionally pin days you already know you want off, or shift the planning window to match your leave year.
5. Suggested days are highlighted in green on the calendar.

## Development

```
pnpm install
pnpm dev        # start the dev server
pnpm lint       # ESLint
pnpm build      # type-check and build to dist/
```

The deploy workflow in `.github/workflows/deploy.yml` builds on every push to `main` and publishes to GitHub Pages. It can
be run locally with [act](https://nektosact.com/):

```
act push -P ubuntu-latest=catthehacker/ubuntu:act-latest --artifact-server-path .act-artifacts
```

The final GitHub Pages deploy step cannot run locally and is expected to fail under act.

Optional future work is tracked in [TODO.md](TODO.md).

## Technologies Used

[![Deploy](https://github.com/himan7991/VacationTimeOptimizer/actions/workflows/deploy.yml/badge.svg)](https://github.com/himan7991/VacationTimeOptimizer/actions/workflows/deploy.yml)
![React](https://img.shields.io/badge/frontend-React-61DBFB?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/frontend-TypeScript-3979c3?style=flat&logo=typescript)
![Tailwind](https://img.shields.io/badge/styling-Tailwind-41b3d3?style=flat&logo=tailwindcss)
![Vite](https://img.shields.io/badge/build-Vite-646CFF?style=flat&logo=vite)

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.
