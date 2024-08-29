
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link"
import Logo from "@/public/images/icons/logo.jpeg"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Github, Globe, Instagram, Linkedin, Mail } from "lucide-react"

export default function page() {
  return (
    <div className="flex flex-col min-h-[100dvh] mt-10 md:mt-0">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 ">
          <div className="mx-auto container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Next Generative Trivia v0.1
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    This Project is a Next.js application that generates trivia questions based on your education level
                  </p>
                  <div className="flex flex-wrap items-center gap-4">
                    <Badge>Next.js</Badge>
                    <Badge>React</Badge>
                    <Badge>Shadcn UI</Badge>
                    <Badge>Typescript</Badge>
                    <Badge>Gemini AI</Badge>
                  </div>
                </div>
              </div>
              <Image src={Logo} alt="Generative Trivia Logo" className="rounded-lg" height={600} width={600} />
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <div className="inline-block rounded-lg bg-muted py-1 text-sm">Alvalens | Fullstack Developer</div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Meet the Creator</h2>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src="https://avatars.githubusercontent.com/u/109880628?v=4" alt="@shadcn" />
                      <AvatarFallback>JP</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-0.5">
                      <div className="text-xl font-bold">Alvalens</div>
                      <div className="text-muted-foreground">Fullstack Developer</div>
                    </div>
                  </div>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Hello my name is Alvalen, I am a Fullstack Developer who loves to create web applications. I am passionate about learning new technologies and building projects that can help people.
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Connect with Me</div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Find Me Online</h2>
                  <div className="flex items-center gap-4">
                    <Link href="https://alvalens.my.id" target="_blank" prefetch={false}>
                      <Globe size={24} />
                    </Link>
                    <Link href="https://github.com/Alvalens" target="_blank" prefetch={false}>
                      <Github size={24} />
                    </Link>
                    <Link href="https://www.linkedin.com/in/alvalens/" target="_blank" prefetch={false}>
                      <Linkedin size={24} />
                    </Link>
                    <Link href="mailto:Alvalen.shafel04@gmail.com?subject=Hello&body=Hello%20Alvalens," target="_blank" prefetch={false}>
                      <Mail size={24} />
                    </Link>
                    <Link href="https://www.instagram.com/alvalens_" target="_blank" prefetch={false}>
                      <Instagram size={24} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
