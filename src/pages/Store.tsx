import { motion } from 'framer-motion'
import { ShoppingBag } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/sections/Footer'

const products = [
  {
    id: '1',
    name: "15'' Green and White Chess Set",
    price: "₹499",
    image: "https://www.1st-chess-sets.com/CHPics/cs091large.jpg",
    description: "Tournament grade vinyl chess mat with solid plastic pieces. Durable and portable."
  },
  {
    id: '2',
    name: "Digital Chess Clock",
    price: "₹999",
    image: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQ1bNzMXUkr4QEwBnLPhUym--Tggopoh9GMqCQt0vamS_PKiI9DXBbSJtAJ4CSFCmk93CaZ1dKQkfB1SVUD_VbBUb6dwtepjJFkLrqayqUGxRh5JQgW5UQuzw",
    description: "Professional digital chess timer with bonus and delay settings. Perfect for blitz and classical games."
  }
]

export default function Store() {
  return (
    <div className="min-h-screen bg-dark">
      <Navbar />

      <main className="pt-32 pb-32 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-neon" />
              <p className="text-neon text-[10px] font-bold uppercase tracking-[0.4em]">Official Gear</p>
            </div>
            <h1 className="font-display text-5xl md:text-7xl font-black text-white uppercase mb-6 leading-none">
              The Chess <span className="text-neon">Store</span>
            </h1>
            <p className="text-white/40 font-body max-w-2xl leading-relaxed">
              Premium chess equipment curated for players in Chhattisgarh. From tournament-grade sets to professional clocks, we've got you covered.
            </p>
          </motion.div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                className="group bg-card-dark border border-white/10 rounded-3xl overflow-hidden hover:border-neon/30 transition-all duration-500 flex flex-col"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Image Container */}
                <div className="relative aspect-square overflow-hidden bg-white/5 p-8 flex items-center justify-center group-hover:bg-white/[0.07] transition-colors">
                  <div className="absolute inset-0 bg-gradient-to-t from-dark/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 mix-blend-lighten relative z-10"
                  />
                  <div className="absolute top-4 right-4 bg-neon/10 backdrop-blur-md border border-neon/20 px-3 py-1 rounded-full">
                    <p className="text-[10px] font-bold text-neon uppercase tracking-widest">{product.price}</p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="font-display text-lg font-bold text-white uppercase mb-2 group-hover:text-neon transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-white/40 text-xs font-body leading-relaxed mb-6 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="mt-auto">
                    <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-xs font-bold text-white uppercase tracking-widest hover:bg-neon hover:text-dark hover:border-neon transition-all duration-300 flex items-center justify-center gap-2 group/btn">
                      <ShoppingBag className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Banner */}
          <motion.div
            className="mt-24 p-12 rounded-[2rem] bg-neon relative overflow-hidden group"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-dark/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />

            <div className="relative z-10 max-w-2xl">
              <h2 className="font-display text-4xl md:text-5xl font-black text-dark uppercase mb-6 leading-tight">
                Bulk Orders for Schools & Clubs?
              </h2>
              <p className="text-dark/70 font-body font-bold text-lg mb-8 uppercase tracking-wide">
                Special discounts available for institutions and registered chess clubs in Chhattisgarh.
              </p>
              <button className="bg-dark text-white px-8 py-4 rounded-full font-display font-bold text-sm uppercase tracking-[0.2em] hover:shadow-2xl hover:-translate-y-1 transition-all">
                Contact for Quote
              </button>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
