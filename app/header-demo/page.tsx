export default function HeaderDemo() {
  return (
    <div className="container mx-auto py-10 px-4 space-y-10">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-dedevs-gradient">DeDevs Prompter Header</h1>
        <p className="text-muted-foreground">A responsive header component with vibrant DeDevs branding</p>
      </div>

      <div className="space-y-6">
        <div className="prose dark:prose-invert max-w-none">
          <h2>Color Scheme</h2>
          <p>The header uses a vibrant color scheme with the following primary colors:</p>
          <div className="flex flex-wrap gap-4 not-prose my-6">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-md bg-dedevs-pink"></div>
              <span className="mt-2 text-sm font-mono">#f300a8</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-md bg-dedevs-cyan"></div>
              <span className="mt-2 text-sm font-mono">#00d3f9</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-md bg-linear-to-r from-dedevs-pink to-dedevs-cyan"></div>
              <span className="mt-2 text-sm font-mono">Gradient</span>
            </div>
          </div>

          <h2>Header Features</h2>
          <ul>
            <li>Responsive design that adapts to all screen sizes</li>
            <li>Vibrant color scheme with magenta-to-cyan gradient</li>
            <li>Mobile-friendly navigation with slide-out menu</li>
            <li>Active link highlighting</li>
            <li>Dark mode support with theme toggle</li>
            <li>Scroll-aware styling (header changes on scroll)</li>
            <li>Accessible with proper ARIA attributes</li>
          </ul>

          <h2>Usage Instructions</h2>
          <p>
            The header component is designed to be placed at the top of your application layout. It automatically
            handles responsive behavior and theme switching.
          </p>

          <pre className="bg-muted p-4 rounded-md overflow-x-auto">
            <code>{`import { SiteHeader } from "@/components/site-header"

export default function Layout({ children }) {
  return (
    <>
      <SiteHeader />
      <main>{children}</main>
    </>
  )
}`}</code>
          </pre>

          <h2>Custom Utility Classes</h2>
          <p>The following utility classes are available for using the DeDevs color scheme in your application:</p>
          <ul>
            <li>
              <code>text-dedevs-gradient</code> - Applies the gradient to text
            </li>
            <li>
              <code>btn-dedevs-gradient</code> - Creates a gradient button
            </li>
            <li>
              <code>bg-dedevs-pink</code>, <code>bg-dedevs-cyan</code> - Solid background colors
            </li>
            <li>
              <code>from-dedevs-pink</code>, <code>to-dedevs-cyan</code> - For custom gradients
            </li>
          </ul>

          <div className="not-prose my-6 flex flex-wrap gap-4">
            <button className="px-4 py-2 rounded-md btn-dedevs-gradient">Gradient Button</button>
            <div className="px-4 py-2 rounded-md bg-white dark:bg-gray-800 border">
              <span className="text-dedevs-gradient font-bold">Gradient Text</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

