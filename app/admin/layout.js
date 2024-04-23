import Headers from "./components/hearder";
import Footer from "./components/footer";
export default function TestLayout({ children }) {
    return (
        <section>
            <Headers />
            <main className="mt-5">
                {children}
            </main>
            <Footer />
        </section>
    );
}