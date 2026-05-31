import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Car, MapPin, Shield, Users, ArrowLeft } from "lucide-react";

const FEATURES = [
  {
    icon: Shield,
    title: "סטודנטים מאומתים בלבד",
    desc: "כניסה עם אימייל אוניברסיטאי — כולם מאומתים, כולם בטוחים",
    color: "text-primary",
    bg: "bg-primary/15",
  },
  {
    icon: MapPin,
    title: "חיפוש לפי מיקום",
    desc: "מצא נסיעות בטווח הרצוי ממך — לפי רדיוס ולוח זמנים מדויק",
    color: "text-secondary",
    bg: "bg-secondary/15",
  },
  {
    icon: Users,
    title: "כל האוניברסיטאות",
    desc: "BGU, SCE, ספיר ועוד — כל הסטודנטים בעיר שלך באותה פלטפורמה",
    color: "text-primary",
    bg: "bg-primary/15",
  },
];

const STATS = [
  { value: "4", label: "אוניברסיטאות" },
  { value: "500+", label: "סטודנטים רשומים" },
  { value: "1,200+", label: "נסיעות הושלמו" },
  { value: "4.9★", label: "דירוג ממוצע" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* ── Header ── */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Car className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold text-foreground">CarpoolBuddies</span>
          </div>
          <nav className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">כניסה</Button>
            </Link>
            <Link href="/login">
              <Button size="sm">הרשמה חינמית</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="container mx-auto px-6 pb-16 pt-24 text-center animate-fade-in">
        <Badge variant="outline" className="mb-6 border-primary/30 bg-primary/10 text-primary">
          🎓 לסטודנטים, על ידי סטודנטים
        </Badge>

        <h1 className="mx-auto mb-6 max-w-3xl text-5xl font-black leading-tight tracking-tight md:text-6xl">
          נסיעות חכמות.{" "}
          <span className="text-gradient">יחד.</span>
        </h1>

        <p className="mx-auto mb-10 max-w-xl text-lg text-muted-foreground">
          הפלטפורמה הבלעדית לשיתוף נסיעות בין סטודנטים מאומתים.
          <br />
          מצא נסיעה, שתף עלויות, הכר סטודנטים מהאזור שלך.
        </p>

        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/login">
            <Button size="lg" className="w-full gap-2 sm:w-auto">
              התחל עכשיו — בחינם
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <a href="#features">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              איך זה עובד
            </Button>
          </a>
        </div>

        {/* Social proof */}
        <div className="mt-8 flex items-center justify-center gap-1 text-sm text-muted-foreground">
          <div className="flex -space-x-2 rtl:space-x-reverse">
            {["ד", "י", "ר", "ש"].map((letter, i) => (
              <div
                key={i}
                className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-background bg-primary text-xs font-bold text-white"
              >
                {letter}
              </div>
            ))}
          </div>
          <span className="mr-3">500+ סטודנטים כבר בפנים</span>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="border-y border-border bg-card/50">
        <div className="container mx-auto grid grid-cols-2 divide-x divide-border px-6 rtl:divide-x-reverse md:grid-cols-4">
          {STATS.map(({ value, label }) => (
            <div key={label} className="px-6 py-8 text-center">
              <div className="text-3xl font-black text-primary">{value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="container mx-auto px-6 py-20">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-black text-foreground">
            למה <span className="text-gradient">CarpoolBuddies</span>?
          </h2>
          <p className="mt-3 text-muted-foreground">
            לא עוד קבוצות ווטסאפ. פלטפורמה אחת לכל הנסיעות.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, desc, color, bg }) => (
            <Card
              key={title}
              className="group cursor-default transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
            >
              <CardContent className="p-6">
                <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${bg}`}>
                  <Icon className={`h-6 w-6 ${color}`} />
                </div>
                <h3 className="mb-2 text-lg font-bold text-foreground">{title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ── vs WhatsApp comparison ── */}
      <section className="container mx-auto px-6 py-12">
        <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-card to-primary/5">
          <CardContent className="p-8">
            <h2 className="mb-8 text-center text-2xl font-black">
              CarpoolBuddies vs. קבוצת ווטסאפ
            </h2>
            <div className="grid gap-3 md:grid-cols-2">
              {[
                ["ניהול מושבים אוטומטי", "ספירה ידנית בצ'אט"],
                ["חיפוש לפי רדיוס GPS", "גלילה אינסופית בהודעות"],
                ["דירוגים ואמינות", "אין דרך לדעת מי האדם"],
                ["תזכורות אוטומטיות", "תמיד שוכחים להזכיר"],
                ["פיצול עלויות מובנה", "מי שילם למי? אף אחד לא זוכר"],
                ["כל הסטודנטים בעיר", "רק מי בקבוצה שלך"],
              ].map(([ours, theirs]) => (
                <div key={ours} className="flex items-start gap-4 rounded-lg bg-muted/40 p-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-sm font-semibold text-secondary">
                      <span className="text-base">✓</span> {ours}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground line-through">
                      <span className="text-base no-underline">✗</span> {theirs}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ── CTA ── */}
      <section className="container mx-auto px-6 py-20 text-center">
        <h2 className="mb-4 text-4xl font-black">
          מוכן להתחיל?
        </h2>
        <p className="mb-8 text-muted-foreground">
          הצטרף עם האימייל האוניברסיטאי שלך — תוך 30 שניות
        </p>
        <Link href="/login">
          <Button size="lg" className="px-10 text-base">
            הרשמה עם Google / Microsoft
          </Button>
        </Link>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-muted-foreground sm:flex-row">
          <div className="flex items-center gap-2">
            <Car className="h-4 w-4 text-primary" />
            <span className="font-semibold text-foreground">CarpoolBuddies</span>
          </div>
          <span>© 2026 כל הזכויות שמורות</span>
        </div>
      </footer>
    </div>
  );
}
