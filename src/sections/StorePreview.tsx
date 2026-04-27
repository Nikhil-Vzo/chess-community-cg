import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const products = [
  {
    id: '1',
    name: "15'' Green and White Chess Set",
    price: "₹499",
    image: "https://www.1st-chess-sets.com/CHPics/cs091large.jpg",
  },
  {
    id: '2',
    name: "Digital Chess Clock",
    price: "₹999",
    image: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQ1bNzMXUkr4QEwBnLPhUym--Tggopoh9GMqCQt0vamS_PKiI9DXBbSJtAJ4CSFCmk93CaZ1dKQkfB1SVUD_VbBUb6dwtepjJFkLrqayqUGxRh5JQgW5UQuzw",
  }
]

export function StorePreview() {
  return (
    <section className="bg-dark py-24 md:py-32 px-6 border-t border-white/5">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <motion.p
              className="text-neon text-sm font-body uppercase tracking-[0.3em] mb-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Equip Yourself
            </motion.p>
            <motion.h2
              className="font-display text-5xl md:text-7xl font-bold text-white uppercase leading-none"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Chess <span className="text-neon">Store</span>
            </motion.h2>
          </div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Link 
              to="/store" 
              className="group flex items-center gap-3 text-white/60 hover:text-neon transition-colors"
            >
              <span className="font-body font-bold text-xs uppercase tracking-widest">View Full Store</span>
              <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-neon/50 group-hover:bg-neon/10 transition-all">
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              className="group bg-card-dark border border-white/10 rounded-lg overflow-hidden hover:border-neon/30 transition-all duration-300 hover:-translate-y-1 flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {/* Image */}
              <div className="relative h-72 overflow-hidden bg-white/5 flex items-center justify-center p-8">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 mix-blend-lighten"
                />
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-4 gap-4">
                  <h3 className="font-display text-2xl font-bold text-white uppercase group-hover:text-neon transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                  <span className="text-neon font-display font-bold text-2xl shrink-0">
                    {product.price}
                  </span>
                </div>

                <div className="mt-auto pt-6 flex items-center justify-end border-t border-white/10">
                  <button className="flex items-center gap-2 text-sm font-body text-neon hover:text-white transition-colors uppercase tracking-wider bg-neon/10 hover:bg-neon/20 px-6 py-2.5 rounded-full">
                    Buy Now
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
