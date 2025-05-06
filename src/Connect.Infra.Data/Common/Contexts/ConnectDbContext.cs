using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Connect;

public class ConnectDbContext(DbContextOptions<ConnectDbContext> options) : DbContext(options)
{
    public DbSet<AccountDao> Accounts { get; set; }
    public DbSet<ChannelPartnerDao> ChannelPartners { get; set; }
    
    public DbSet<SoldInventoryDao> SoldInventory { get; set; }
    
    public DbSet<AssuredPriceDao> AssuredPrice { get; set; }
    
    public DbSet<NewInventoryDao> NewInventory { get; set; }
    
    public DbSet<ClientDao> Clients { get; set; }
    
    public DbSet<PropertyRecordDao> PropertyRecords { get; set; }
    
    public DbSet<ClientPaymentDao> ClientPayments { get; set; }
    
    public IQueryable<T> ReadOnlySet<T>() where T : class =>
        Set<T>().AsNoTracking();
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AccountDao>(entity =>
        {
            entity.ToTable("account");

            entity.HasKey(e => e.Id);

            entity.Property(e => e.Id)
                .HasColumnName("id");

            entity.Property(e => e.EmailId)
                .HasColumnName("email_id")
                .IsRequired()
                .HasMaxLength(256);

            entity.HasIndex(e => e.EmailId)
                .IsUnique();

            entity.Property(e => e.Name)
                .HasColumnName("name")
                .IsRequired()
                .HasMaxLength(256);

            entity.Property(e => e.Group)
                .HasColumnName("group")
                .HasConversion<string>()
                .IsRequired();

            entity.Property(e => e.State)
                .HasColumnName("state")
                .HasConversion<string>()
                .IsRequired();

            entity.OwnsOne(e => e.Password, pw =>
            {
                pw.Property(p => p.Salt).HasColumnName("password_salt").IsRequired();
                pw.Property(p => p.Hash).HasColumnName("password_hash").IsRequired();
                pw.Property(p => p.IterationCount).HasColumnName("password_iterations").IsRequired();
                pw.Property(p => p.UpdateTime).HasColumnName("password_updated").IsRequired();
            });

            entity.OwnsOne(e => e.Auth, auth =>
            {
                auth.Property(a => a.Token).HasColumnName("auth_token").IsRequired();
                auth.Property(a => a.CreateTime).HasColumnName("auth_created").IsRequired();
            });
        });

        modelBuilder.Entity<ChannelPartnerDao>(entity =>
        {
            entity.ToTable("channel_partner");

            entity.HasKey(e => e.Id);

            entity.Property(e => e.Id)
                .HasColumnName("id")
                .HasDefaultValueSql("gen_random_uuid()");

            entity.Property(e => e.Name)
                .HasColumnName("name")
                .HasMaxLength(255)
                .IsRequired();
        });

        modelBuilder.Entity<SoldInventoryDao>(entity =>
        {
            entity.ToTable("sold_inventory");

            entity.HasKey(e => e.Id);

            entity.Property(e => e.Id)
                .HasColumnName("id")
                .HasDefaultValueSql("gen_random_uuid()");

            entity.Property(e => e.BookingId)
                .HasColumnName("booking_id")
                .HasMaxLength(255);
            
            entity.Property(e => e.BookingDate)
                .HasColumnName("booking_date")
                .IsRequired();
            
            entity.Property(e => e.ProjectName)
                .HasColumnName("project_name")
                .HasMaxLength(255)
                .IsRequired();
            
            entity.Property(e => e.ProjectType)
                .HasColumnName("project_type")
                .HasMaxLength(255)
                .IsRequired();
            
            entity.Property(e => e.UnitNo)
                .HasColumnName("unit_no")
                .HasMaxLength(255)
                .IsRequired();
            
            entity.Property(e => e.UniqueKey)
                .HasColumnName("unique_key")
                .HasMaxLength(255)
                .IsRequired();
            
            entity.Property(e => e.BuyerName)
                .HasColumnName("buyer_name")
                .HasMaxLength(255)
                .IsRequired();
            
            entity.Property(e => e.BuiltUpArea)
                .HasColumnName("built_up_area")
                .IsRequired();
            
            entity.Property(e => e.Rate)
                .HasColumnName("rate")
                .IsRequired();
            
            entity.Property(e => e.TotalConsideration)
                .HasColumnName("total_consideration")
                .IsRequired();
            
            entity.Property(e => e.NetReceived)
                .HasColumnName("net_received")
                .IsRequired();

            entity.HasIndex(e => e.UniqueKey).IsUnique();
        });

        modelBuilder.Entity<AssuredPriceDao>(entity =>
        {
            entity.ToTable("assured_price");

            entity.HasKey(e => e.Id);

            entity.Property(e => e.Id)
                .HasColumnName("id")
                .HasDefaultValueSql("gen_random_uuid()"); // PostgresSQL UUID generator

            entity.Property(e => e.ProjectType)
                .HasColumnName("project_type")
                .HasMaxLength(255)
                .IsRequired();

            entity.Property(e => e.ProjectName)
                .HasColumnName("project_name")
                .HasMaxLength(255)
                .IsRequired();

            entity.Property(e => e.UnitNo)
                .HasColumnName("unit_no")
                .HasMaxLength(255)
                .IsRequired();

            entity.Property(e => e.UniqueKey)
                .HasColumnName("unique_key")
                .HasMaxLength(255)
                .IsRequired();

            entity.HasIndex(e => e.UniqueKey)
                .IsUnique();

            entity.Property(e => e.AssuredPrice)
                .HasColumnName("assured_price")
                .HasMaxLength(100)
                .IsRequired();

            entity.Property(e => e.RevisedAssuredPrice)
                .HasColumnName("revised_assured_price");
        });
        
        modelBuilder.Entity<NewInventoryDao>(entity =>
        {
            entity.ToTable("new_inventory");

            entity.HasKey(e => e.Id);

            entity.Property(e => e.Id)
                .HasColumnName("id")
                .HasDefaultValueSql("gen_random_uuid()"); // PostgresSQL UUID generation

            entity.Property(e => e.ProjectName)
                .HasColumnName("project_name")
                .HasMaxLength(255)
                .IsRequired();

            entity.Property(e => e.ProjectType)
                .HasColumnName("project_type")
                .HasMaxLength(255)
                .IsRequired();

            entity.Property(e => e.UnitNo)
                .HasColumnName("unit_no")
                .HasMaxLength(255)
                .IsRequired();

            entity.Property(e => e.BuiltUpArea)
                .HasColumnName("built_up_area")
                .IsRequired();

            entity.Property(e => e.Rate)
                .HasColumnName("rate")
                .IsRequired();

            entity.Property(e => e.TotalConsideration)
                .HasColumnName("total_consideration")
                .IsRequired();

            entity.Property(e => e.RevisedRate)
                .HasColumnName("revised_rate");

            entity.Property(e => e.RevisedTotalConsideration)
                .HasColumnName("revised_total_consideration");
        });
        
        modelBuilder.Entity<ClientDao>(entity =>
        {
            entity.ToTable("client");

            entity.HasKey(e => new { e.Id, e.Sequence });

            entity.Property(e => e.Id).HasColumnName("id");

            entity.Property(e => e.Sequence)
                .HasColumnName("sequence")
                .UseIdentityAlwaysColumn() // PostgresSQL
                .HasIdentityOptions(startValue:100000, maxValue:999999);
            
            entity.Property(e => e.Name)
                .HasColumnName("name")
                .HasMaxLength(255)
                .IsRequired();

            entity.Property(e => e.EmailId)
                .HasColumnName("email_id")
                .HasMaxLength(255);

            entity.Property(e => e.PhoneNo)
                .HasColumnName("phone_no")
                .HasMaxLength(255);

            // One-to-many SellRecords
            entity.HasMany(e => e.SellRecords)
                .WithOne(e => e.Seller)
                .HasForeignKey(e => new { e.SellerId, e.SellerSequence })
                .OnDelete(DeleteBehavior.Restrict);

            // One-to-many BuyRecords
            entity.HasMany(e => e.BuyRecords)
                .WithOne(e => e.Buyer)
                .HasForeignKey(e => new { e.BuyerId, e.BuyerSequence })
                .OnDelete(DeleteBehavior.Restrict);

            // One-to-one ClientPayment
            entity.HasOne(e => e.ClientPayment)
                .WithOne(e => e.Client)
                .HasForeignKey<ClientPaymentDao>(e => new { e.ClientId, e.ClientSequence })
                .OnDelete(DeleteBehavior.Cascade);
            
            entity.HasOne(e => e.Account)
                .WithMany()
                .HasForeignKey(e => e.AccountId)
                .OnDelete(DeleteBehavior.Restrict);
        });
        
        modelBuilder.Entity<PropertyRecordDao>(entity =>
        {
            entity.ToTable("property_record");

            entity.HasKey(e => e.Id);

            entity.Property(e => e.Id)
                .HasColumnName("id")
                .HasDefaultValueSql("gen_random_uuid()");

            entity.Property(e => e.PropertyRecordId)
                .HasColumnName("property_record_id")
                .IsRequired();

            entity.Property(e => e.Rate)
                .HasColumnName("rate");

            entity.Property(e => e.PaymentPlan)
                .HasColumnName("payment_plan")
                .HasMaxLength(100);

            // Seller (one-to-many)
            entity.HasOne(e => e.Seller)
                .WithMany(c => c.SellRecords)
                .HasForeignKey(e => new { e.SellerId, e.SellerSequence })
                .OnDelete(DeleteBehavior.Restrict);

            // Buyer (one-to-many)
            entity.HasOne(e => e.Buyer)
                .WithMany(c => c.BuyRecords)
                .HasForeignKey(e => new { e.BuyerId, e.BuyerSequence })
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<ClientPaymentDao>(entity =>
        {
            entity.ToTable("client_payment");

            entity.HasKey(e => e.Id);

            entity.Property(e => e.Id)
                .HasColumnName("id")
                .HasDefaultValueSql("gen_random_uuid()"); // PostgreSQL UUID generation

            entity.Property(e => e.AmountPaid)
                .HasColumnName("amount_paid")
                .IsRequired();

            entity.Property(e => e.PaymentMode)
                .HasColumnName("payment_mode")
                .IsRequired();

            entity.Property(e => e.PaymentId)
                .HasColumnName("payment_id")
                .IsRequired();

            entity.Property(e => e.ClientId)
                .HasColumnName("client_id")
                .IsRequired();

            entity.Property(e => e.ClientSequence)
                .HasColumnName("client_sequence")
                .IsRequired();

            entity.Property(e => e.ChannelPartnerId)
                .HasColumnName("channel_partner_id");

            entity.Property(e => e.CustomChannelPartnerName)
                .HasColumnName("custom_channel_partner_name")
                .HasMaxLength(255);

            entity.Property(e => e.CustomChannelPartnerNumber)
                .HasColumnName("custom_channel_partner_number")
                .HasMaxLength(255);

            entity.HasOne(p => p.Client)
                .WithOne(c => c.ClientPayment)
                .HasForeignKey<ClientPaymentDao>(p => new { p.ClientId, p.ClientSequence })
                .OnDelete(DeleteBehavior.Cascade);

            // Optional FK to ChannelPartnerDao
            entity.HasOne(e => e.ChannelPartner)
                .WithMany()
                .HasForeignKey(e => e.ChannelPartnerId)
                .OnDelete(DeleteBehavior.SetNull);
            
            entity.HasOne(e => e.Account)
                .WithMany()
                .HasForeignKey(e => e.AccountId)
                .OnDelete(DeleteBehavior.Restrict);
        });
        
        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            if (!typeof(BaseEntity).IsAssignableFrom(entityType.ClrType))
                continue;

            modelBuilder.Entity(entityType.ClrType)
                .Property(nameof(BaseEntity.CreatedAt))
                .HasColumnName("created_at")
                .IsRequired();

            modelBuilder.Entity(entityType.ClrType)
                .Property(nameof(BaseEntity.UpdatedAt))
                .HasColumnName("updated_at")
                .IsRequired();
        }
    }

    
    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        var entries = ChangeTracker
            .Entries<BaseEntity>()
            .Where(e => e.State == EntityState.Added || e.State == EntityState.Modified);

        var now = DateTime.UtcNow;

        foreach (var entry in entries)
        {
            if (entry.State == EntityState.Added)
                entry.Entity.CreatedAt = now;

            entry.Entity.UpdatedAt = now;
        }

        return await base.SaveChangesAsync(cancellationToken);
    }
}